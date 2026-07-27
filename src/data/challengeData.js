// 랭킹 도전 모드 고정 과목 세트 (사용자 수정 불가)
//
// 시점(학기)에 따른 구분은 challengeId가 아니라 semesterId가 전담한다
// (rankingUtils.fetchRankings가 challengeId + semesterId를 함께 필터링).
// 학기가 바뀌면 자동으로 새 랭킹판이 되므로, 매 학기 과목 이름을 새로 고쳐도
// challengeId는 건드릴 필요가 없다.
//
// challengeId는 오직 난이도/구조(과목 수, 학점, 마감 난이도)가 바뀌어
// 과거 기록과 시간 비교 자체가 더 이상 공정하지 않을 때만 올린다.

export const CHALLENGE_ID = "v1";
export const CHALLENGE_DIFFICULTY = "medium"; // 30~60초 마감
export const CHALLENGE_MAX_CREDITS = 18;

// 수강꾸러미: 목록에서 클릭하여 신청
export const CHALLENGE_CART_COURSES = [
  { id: "35401-01", name: "웹서비스프로그래밍", credit: 3 }, // 컴퓨터공학
  { id: "21302-01", name: "선형대수학", credit: 3 },        // 수학
  { id: "42104-02", name: "마케팅원론", credit: 3 },        // 경영
  { id: "13102-01", name: "심리학개론", credit: 3 },        // 인문/사회
];

// 코드 입력 과목: 코드를 직접 입력해야 신청 가능 → 미리 외워두세요!
export const CHALLENGE_CODE_COURSES = [
  { id: "21303-02", name: "확률및통계", credit: 3 },   // 수학
  { id: "13101-01", name: "철학의이해", credit: 3 },   // 인문
];
