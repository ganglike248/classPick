export const SAMPLE_NAMES = [
  // 컴퓨터/공학
  "자료구조및실습", "운영체제론", "웹서비스프로그래밍",
  // 수학/자연과학
  "미적분학1", "선형대수학", "일반물리학및실험", "확률및통계",
  // 경상/경영
  "경영학원론", "경제학원론", "회계학원론", "마케팅원론",
  // 인문/사회
  "글쓰기와커뮤니케이션", "철학의이해", "심리학개론", "사회학개론",
  "역사와문화", "법학개론",
  // 교양
  "체육실기", "건강과웰빙", "창의와혁신",
];

export function checkDuplicates(cartRows, regRows, codeRows) {
  const set = new Set();
  for (const row of [...cartRows, ...regRows, ...codeRows]) {
    if (set.has(row.id)) return `강좌번호 ${row.id}가 여러 섹션에 중복되어 있습니다.`;
    set.add(row.id);
  }
  return null;
}

export function generateRandomId(taken) {
  let attempts = 0;
  while (attempts < 1000) {
    attempts++;
    const front = String(10000 + Math.floor(Math.random() * 90000));
    const back = String(Math.floor(Math.random() * 5) + 1).padStart(2, "0");
    const id = `${front}-${back}`;
    if (!taken.has(id)) {
      taken.add(id);
      return id;
    }
  }
  throw new Error("랜덤 강좌번호 생성 실패");
}

export function getAllExistingIds(rows) {
  const set = new Set();
  rows.forEach((r) => set.add(r.id));
  return set;
}

export function hasCourseId(cartRows, regRows, codeRows, id) {
  return (
    cartRows.some((r) => r.id === id) ||
    regRows.some((r) => r.id === id) ||
    codeRows.some((r) => r.id === id)
  );
}

export function formatPresetDate(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
