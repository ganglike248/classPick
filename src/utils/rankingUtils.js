import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

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
    startedAt: serverTimestamp(),
    status: "in_progress",
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
  });
}

/**
 * 특정 challengeId의 완료된 랭킹 목록 조회
 * 클라이언트에서 정렬: 신청 성공 과목 수 내림차순 → 소요 시간 오름차순
 */
export async function fetchRankings(challengeId) {
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

  return docs;
}
