// 랭킹 도전 모드 고정 과목 세트 (사용자 수정 불가)
// 변경 시 challengeId 버전을 올려야 기존 랭킹과 분리됩니다.

export const CHALLENGE_ID = "v1";
export const CHALLENGE_DIFFICULTY = "medium"; // 30~60초 마감
export const CHALLENGE_MAX_CREDITS = 18;

// 수강꾸러미: 목록에서 클릭하여 신청
export const CHALLENGE_CART_COURSES = [
  { id: "35201-01", name: "자료구조및실습", credit: 3 },
  { id: "35302-01", name: "운영체제론", credit: 3 },
  { id: "36101-02", name: "인공지능개론", credit: 3 },
  { id: "12104-01", name: "실용영어회화", credit: 2 },
];

// 코드 입력 과목: 코드를 직접 입력해야 신청 가능 → 미리 외워두세요!
export const CHALLENGE_CODE_COURSES = [
  { id: "35401-01", name: "소프트웨어공학", credit: 3 },
  { id: "35502-02", name: "데이터베이스설계", credit: 3 },
];
