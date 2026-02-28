// 랭킹 도전 모드 고정 과목 세트 (사용자 수정 불가)
// 변경 시 challengeId 버전을 올려야 기존 랭킹과 분리됩니다.

export const CHALLENGE_ID = "v1";
export const CHALLENGE_DIFFICULTY = "medium"; // 30~60초 마감
export const CHALLENGE_MAX_CREDITS = 18;

// 수강꾸러미: 목록에서 클릭하여 신청
export const CHALLENGE_CART_COURSES = [
  { id: "11001-01", name: "자료구조", credit: 3 },
  { id: "11002-01", name: "알고리즘", credit: 3 },
  { id: "11003-02", name: "운영체제", credit: 3 },
  { id: "11004-01", name: "컴퓨터네트워크", credit: 3 },
];

// 코드 입력 과목: 코드를 직접 입력해야 신청 가능 → 미리 외워두세요!
export const CHALLENGE_CODE_COURSES = [
  { id: "21001-01", name: "소프트웨어공학", credit: 3 },
  { id: "21002-02", name: "데이터베이스", credit: 3 },
];
