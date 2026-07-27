import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const IN_PROGRESS_TTL_MS = 2 * 60 * 60 * 1000; // 2시간: 방치된 세션 자동 정리 기준
const RANKINGS_CACHE_TTL_MS = 60 * 1000; // 1분: 같은 브라우저 탭 안에서의 반복 조회만 줄여줌
                                          // (사용자마다 캐시가 따로 생기므로 동시접속자 간 요청 자체를 줄이지는 못함)

export const RANKINGS_COLLECTION = "rankings";

// key: challengeId → { data, expiresAt }
const rankingsCache = new Map();

/** 도전 완료/닉네임 변경/삭제 등으로 랭킹 데이터가 바뀌었을 때 캐시를 전부 비움 */
function invalidateRankingsCache() {
  rankingsCache.clear();
}

/** 이미 로그인돼 있으면 그대로, 아니면 익명 로그인 */
async function ensureSignedIn() {
  // 익명 세션이면 그대로 재사용. 익명이 아니면(예: /feedback 관리자 계정으로 로그인된 상태)
  // 도전 기록이 실명 계정에 붙지 않도록 새 익명 세션으로 전환한다.
  if (auth.currentUser?.isAnonymous) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

/**
 * 도전 세션 시작: Firestore에 startedAt(serverTimestamp)과 함께 문서 생성
 * @returns {string} docId
 */
export async function startChallengeSession(nickname, challengeId) {
  const user = await ensureSignedIn();
  const docRef = await addDoc(collection(db, RANKINGS_COLLECTION), {
    uid: user.uid,
    nickname: nickname || "익명",
    challengeId,
    startedAt: serverTimestamp(),
    status: "in_progress",
    // 완료되지 못하고 방치된 세션을 Firestore TTL로 자동 정리하기 위한 만료 시각
    expiresAt: Timestamp.fromMillis(Date.now() + IN_PROGRESS_TTL_MS),
  });
  return docRef.id;
}

/**
 * 도전 세션 완료: endedAt(serverTimestamp)과 결과를 업데이트
 * elapsed는 서버에서 endedAt - startedAt으로 계산되므로 클라이언트 제출 불필요
 */
export async function finishChallengeSession(docId, result) {
  await updateDoc(doc(db, RANKINGS_COLLECTION, docId), {
    endedAt: serverTimestamp(),
    status: "completed",
    result,
    // 완료된 기록은 TTL 정리 대상에서 제외 (expiresAt은 미완료 세션 정리용)
    expiresAt: deleteField(),
  });
  invalidateRankingsCache();
}

/**
 * 특정 challengeId(버전)의 완료된 랭킹 목록 조회 (버전별로 구분)
 * 클라이언트에서 정렬: 신청 성공 과목 수 내림차순 → 소요 시간 오름차순
 *
 * 같은 브라우저 탭에서 짧은 시간 안에 반복 조회하는 걸 줄이기 위해
 * RANKINGS_CACHE_TTL_MS 동안 결과를 재사용한다 (forceRefresh로 우회 가능).
 * 정렬 기준(소요 시간)이 Firestore에 저장된 필드가 아니라 클라이언트 계산값이라
 * limit()으로 미리 잘라올 수 없어, 매 조회마다 전체를 읽어와야 하는 건 그대로다.
 */
export async function fetchRankings(challengeId, { forceRefresh = false } = {}) {
  const cacheKey = challengeId;

  if (!forceRefresh) {
    const cached = rankingsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  const q = query(
    collection(db, RANKINGS_COLLECTION),
    where("status", "==", "completed"),
    where("challengeId", "==", challengeId)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  docs.sort((a, b) => {
    const aCount = a.result?.registeredCount ?? 0;
    const bCount = b.result?.registeredCount ?? 0;
    if (bCount !== aCount) return bCount - aCount;
    // elapsed: serverTimestamp → Firestore Timestamp 객체, .toMillis() 사용
    const aMs = a.endedAt?.toMillis?.() - a.startedAt?.toMillis?.();
    const bMs = b.endedAt?.toMillis?.() - b.startedAt?.toMillis?.();
    return (aMs ?? 0) - (bMs ?? 0);
  });

  // 사용자(uid)별 최고 기록만 유지 (정렬 후 첫 등장 = 최고 기록)
  // 닉네임이 아닌 uid로 구분하므로, 서로 다른 사용자가 같은 닉네임을 쓰더라도
  // 기록이 서로를 덮어쓰지 않는다.
  const seen = new Set();
  const result = docs.filter((d) => {
    if (seen.has(d.uid)) return false;
    seen.add(d.uid);
    return true;
  });

  rankingsCache.set(cacheKey, { data: result, expiresAt: Date.now() + RANKINGS_CACHE_TTL_MS });
  return result;
}

/**
 * 본인 기록의 닉네임 수정 (완료된 기록만, 본인 uid만 가능 — firestore.rules에서 강제)
 */
export async function renameOwnRecord(docId, newNickname) {
  await updateDoc(doc(db, RANKINGS_COLLECTION, docId), {
    nickname: newNickname,
  });
  invalidateRankingsCache();
}

/**
 * 본인 기록 삭제 (완료된 기록만, 본인 uid만 가능 — firestore.rules에서 강제)
 */
export async function deleteOwnRecord(docId) {
  await deleteDoc(doc(db, RANKINGS_COLLECTION, docId));
  invalidateRankingsCache();
}
