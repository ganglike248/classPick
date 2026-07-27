import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const FEEDBACK_COLLECTION = "feedback";
const MAX_MESSAGE_LENGTH = 1000;

/**
 * 익명으로 피드백 메시지 전송 (로그인 불필요, 누구나 작성 가능 — firestore.rules에서 길이만 검증)
 */
export async function submitFeedback(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error("메시지가 비어 있습니다.");
  }
  await addDoc(collection(db, FEEDBACK_COLLECTION), {
    message: trimmed.slice(0, MAX_MESSAGE_LENGTH),
    createdAt: serverTimestamp(),
  });
}

/**
 * 관리자(FEEDBACK_ADMIN_EMAIL로 로그인한 계정)만 조회 가능 — firestore.rules에서 강제
 */
export async function fetchFeedbackList() {
  const q = query(collection(db, FEEDBACK_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * 관리자만 삭제 가능 — firestore.rules에서 강제
 */
export async function deleteFeedback(docId) {
  await deleteDoc(doc(db, FEEDBACK_COLLECTION, docId));
}

/** 현재 로그인한 사용자가 피드백 관리자(이메일 인증 계정)인지 여부 */
export function isFeedbackAdmin() {
  return !!auth.currentUser && !auth.currentUser.isAnonymous;
}
