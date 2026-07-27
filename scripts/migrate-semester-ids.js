// 학기 구분 기능 도입 이전에 만들어진 모든 랭킹 기록에 semesterId를 채워넣는 1회성 마이그레이션 스크립트.
// 클라이언트 SDK(firestore.rules)로는 본인 uid 소유 기록만 고칠 수 있어서,
// 다른 세션/브라우저로 만들어진 과거 기록까지 전부 채우려면 관리자 권한이 필요하다.
//
// 실행 방법:
//   1. Firebase 콘솔 > 프로젝트 설정(⚙️) > 서비스 계정 탭 > "새 비공개 키 생성" 클릭 → JSON 다운로드
//   2. 다운로드한 파일을 프로젝트 루트에 serviceAccountKey.json 이름으로 저장
//      (.gitignore에 등록되어 있어 커밋되지 않음 — 이 파일은 프로젝트 전체에 대한 관리자 권한을
//       가지므로 절대 공유하거나 커밋하지 말 것. 작업 후 삭제해도 무방함)
//   3. npm install
//   4. node scripts/migrate-semester-ids.js --dry-run   ← 먼저 실행해서 결과 미리 확인
//   5. node scripts/migrate-semester-ids.js              ← 문제없으면 실제 반영

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const dryRun = process.argv.includes("--dry-run");

const serviceAccount = JSON.parse(
  readFileSync(new URL("../serviceAccountKey.json", import.meta.url))
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// src/utils/semesterUtils.js와 동일한 규칙 (관리 스크립트라 독립적으로 재구현)
const MIN_SEMESTER_ID = "2026-1";

function getSemesterId(date) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return month <= 6 ? `${year}-1` : `${year}-2`;
}

function semesterIndex(id) {
  const [year, half] = id.split("-").map(Number);
  return year * 2 + (half - 1);
}

function clampSemesterId(id) {
  return semesterIndex(id) < semesterIndex(MIN_SEMESTER_ID) ? MIN_SEMESTER_ID : id;
}

async function main() {
  const snapshot = await db.collection("rankings").where("status", "==", "completed").get();
  const targets = snapshot.docs.filter((doc) => !("semesterId" in doc.data()));

  console.log(`전체 완료 기록 ${snapshot.size}개 중 semesterId가 없는 기록 ${targets.length}개 발견`);
  if (targets.length === 0) {
    console.log("채워넣을 기록이 없습니다.");
    return;
  }

  const plan = targets.map((doc) => {
    const startedAt = doc.data().startedAt?.toDate?.() ?? new Date();
    return { id: doc.id, semesterId: clampSemesterId(getSemesterId(startedAt)) };
  });

  const counts = {};
  for (const { semesterId } of plan) counts[semesterId] = (counts[semesterId] || 0) + 1;
  console.log("학기별 분포:", counts);

  if (dryRun) {
    console.log("--dry-run 모드: 실제로 저장하지 않았습니다.");
    return;
  }

  // Firestore 배치는 최대 500개 작업까지만 허용되므로 500개씩 나눠서 커밋
  const CHUNK_SIZE = 500;
  for (let i = 0; i < plan.length; i += CHUNK_SIZE) {
    const chunk = plan.slice(i, i + CHUNK_SIZE);
    const batch = db.batch();
    chunk.forEach(({ id, semesterId }) => {
      batch.update(db.collection("rankings").doc(id), { semesterId });
    });
    await batch.commit();
    console.log(`${i + chunk.length} / ${plan.length}개 반영 완료`);
  }

  console.log("마이그레이션 완료.");
}

main().catch((e) => {
  console.error("마이그레이션 실패:", e);
  process.exit(1);
});
