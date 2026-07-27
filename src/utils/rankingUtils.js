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
import { getSemesterId, clampSemesterId } from "./semesterUtils";

const IN_PROGRESS_TTL_MS = 2 * 60 * 60 * 1000; // 2시간: 방치된 세션 자동 정리 기준

export const RANKINGS_COLLECTION = "rankings";

/** 이미 로그인돼 있으면 그대로, 아니면 익명 로그인 */
async function ensureSignedIn() {
  if (auth.currentUser) return auth.currentUser;
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
    semesterId: getSemesterId(),
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
}

/**
 * 특정 challengeId + semesterId의 완료된 랭킹 목록 조회 (학기별로 구분)
 * semesterId를 생략하면 현재 학기를 기준으로 조회
 * 클라이언트에서 정렬: 신청 성공 과목 수 내림차순 → 소요 시간 오름차순
 */
export async function fetchRankings(challengeId, semesterId = getSemesterId()) {
  const q = query(
    collection(db, RANKINGS_COLLECTION),
    where("status", "==", "completed"),
    where("challengeId", "==", challengeId),
    where("semesterId", "==", semesterId)
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
  return docs.filter((d) => {
    if (seen.has(d.uid)) return false;
    seen.add(d.uid);
    return true;
  });
}

/**
 * 본인 기록의 닉네임 수정 (완료된 기록만, 본인 uid만 가능 — firestore.rules에서 강제)
 */
export async function renameOwnRecord(docId, newNickname) {
  await updateDoc(doc(db, RANKINGS_COLLECTION, docId), {
    nickname: newNickname,
  });
}

/**
 * 본인 기록 삭제 (완료된 기록만, 본인 uid만 가능 — firestore.rules에서 강제)
 */
export async function deleteOwnRecord(docId) {
  await deleteDoc(doc(db, RANKINGS_COLLECTION, docId));
}

/**
 * 학기 구분 도입 이전에 만들어진 본인 완료 기록에 semesterId를 채워넣음
 * startedAt 기준으로 학기를 계산해 채우며, 이미 semesterId가 있는 기록은 건드리지 않음
 * (firestore.rules에서도 semesterId가 없는 기록에 한해 1회만 채우는 것을 강제)
 * 다른 사용자의 기록은 채울 수 없으므로, 각자 자신의 브라우저로 접속했을 때 자동 적용됨
 */
export async function backfillOwnSemesterIds() {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, RANKINGS_COLLECTION),
    where("uid", "==", user.uid),
    where("status", "==", "completed")
  );
  const snapshot = await getDocs(q);
  const targets = snapshot.docs.filter((d) => !("semesterId" in d.data()));

  await Promise.all(
    targets.map((d) => {
      const startedAt = d.data().startedAt;
      const semesterId = clampSemesterId(getSemesterId(startedAt?.toDate?.() ?? new Date()));
      return updateDoc(doc(db, RANKINGS_COLLECTION, d.id), { semesterId });
    })
  );
}
