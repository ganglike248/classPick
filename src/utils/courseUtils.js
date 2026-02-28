export const SAMPLE_NAMES = [
  "연습과목 A", "연습과목 B", "연습과목 C", "테스트과목 D", "테스트과목 E",
  "더미과목 F", "모의과목 G", "가상과목 H", "샘플과목 I", "샘플과목 J",
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
    const back = String(Math.floor(Math.random() * 99) + 1).padStart(2, "0");
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
  return new Date(timestamp).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
