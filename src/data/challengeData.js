// 랭킹 도전 모드 고정 과목 세트 (사용자 수정 불가)
//
// 랭킹판 구분은 challengeId(버전) 하나로 전담한다
// (rankingUtils.fetchRankings가 challengeId로 필터링).
// challengeId는 과거 기록과 시간 비교 자체가 더 이상 공정하지 않을 때만 올린다
// (예: 과목 수/학점/마감 난이도 변경, 캡차 지연 등 소요 시간에 영향을 주는 변경).
// 새 버전을 추가할 때는 CHALLENGE_ID를 올리고 아래 CHALLENGE_VERSIONS에도 추가한다.

export const CHALLENGE_ID = "v2";
export const CHALLENGE_DIFFICULTY = "medium"; // 30~60초 마감
export const CHALLENGE_MAX_CREDITS = 18;

// 등장 순서대로 정리한 전체 버전 목록 (오래된 것 → 최신).
// note: 랭킹 페이지에서 해당 버전을 조회할 때 보여줄 참고사항 (없으면 null)
export const CHALLENGE_VERSIONS = [
  {
    id: "v1",
    note: "이 버전 기록에는 캡차(보안문자) 표시 지연이 없어 이후 버전 기록보다 약 12초 정도 더 빠르게 기록되었습니다.",
  },
  {
    id: "v2",
    note: null, // 캡차 표시에 과목당 2초 고정 지연 추가
  },
];

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
