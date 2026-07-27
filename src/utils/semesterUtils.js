// 대학교 학기 구분: 1~6월 = 1학기, 7~12월 = 2학기
// 수강신청은 학기가 시작하기 전(방학 중)에 이뤄지므로 넉넉하게 반년 단위로 나눈다.

// 랭킹 도전 모드가 생기기 전 데이터라 그 이전 학기는 표시할 필요가 없음
export const MIN_SEMESTER_ID = "2026-1";

/** 주어진 날짜가 속한 학기 ID ("2026-1" 형식)를 반환 */
export function getSemesterId(date = new Date()) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return month <= 6 ? `${year}-1` : `${year}-2`;
}

/** 학기 ID를 "2026년 1학기" 형식으로 변환 */
export function getSemesterLabel(semesterId) {
  const [year, half] = semesterId.split("-");
  return `${year}년 ${half}학기`;
}

/** 학기 ID의 시작일/종료일 ("2026.01.01" 형식) */
export function getSemesterDateRange(semesterId) {
  const [year, half] = semesterId.split("-");
  return half === "1"
    ? { start: `${year}.01.01`, end: `${year}.06.30` }
    : { start: `${year}.07.01`, end: `${year}.12.31` };
}

/** "2026.01.01 ~ 2026.06.30" 형식 */
export function getSemesterRangeLabel(semesterId) {
  const { start, end } = getSemesterDateRange(semesterId);
  return `${start} ~ ${end}`;
}

function semesterIndex(semesterId) {
  const [year, half] = semesterId.split("-").map(Number);
  return year * 2 + (half - 1);
}

function semesterIdFromIndex(index) {
  const half = (index % 2) + 1;
  const year = (index - (half - 1)) / 2;
  return `${year}-${half}`;
}

/** MIN_SEMESTER_ID보다 이전 학기면 MIN_SEMESTER_ID로 보정 */
export function clampSemesterId(semesterId) {
  return semesterIndex(semesterId) < semesterIndex(MIN_SEMESTER_ID) ? MIN_SEMESTER_ID : semesterId;
}

/** 현재 학기부터 과거 순으로 최근 학기 ID 목록을 반환 (MIN_SEMESTER_ID 이전은 제외) */
export function getRecentSemesterIds(count = 4) {
  const currentIndex = semesterIndex(getSemesterId());
  const minIndex = semesterIndex(MIN_SEMESTER_ID);
  const ids = [];
  for (let i = 0; i < count; i++) {
    const idx = currentIndex - i;
    if (idx < minIndex) break;
    ids.push(semesterIdFromIndex(idx));
  }
  return ids;
}
