export const SAMPLE_NAMES = [
  "객체지향프로그래밍", "알고리즘분석", "컴퓨터구조", "이산수학",
  "웹서비스프로그래밍", "컴파일러설계", "임베디드시스템", "시스템프로그래밍",
  "선형대수학", "확률및통계", "경제학원론", "심리학개론", "철학의이해",
  "비판적사고와글쓰기", "창의와혁신", "사회학개론", "역사와문화",
  "과학기술과사회", "환경과생태", "경영학원론",
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
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
