// 사이트 전역에서 재사용하는 상수

// /feedback 관리자 로그인에 사용하는 계정 이메일.
// 이 이메일로 Firebase 콘솔 > Authentication > 사용자 추가에서
// 비밀번호(6자 이상)를 설정해 계정을 만들어야 로그인할 수 있음.
// firestore.rules의 feedback 컬렉션 규칙도 이 이메일과 같이 맞춰져 있음.
export const FEEDBACK_ADMIN_EMAIL = "business9498@gmail.com";
