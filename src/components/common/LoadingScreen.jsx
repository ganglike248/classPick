// 상태 로딩 중이거나(예: Firebase 인증 확인) 필요한 데이터가 없어 곧 다른
// 페이지로 이동할 예정일 때 사용하는 화면. 이 컴포넌트를 쓰기 전에는 이런
// 경우 `return null`로 완전히 빈 화면을 그렸는데, 애드센스 심사 크롤러처럼
// 앱 흐름 없이 URL에 바로 접속하는 방문자에게는 "콘텐츠가 없는 화면"으로
// 보여 정책 위반으로 이어질 수 있다. 항상 눈에 보이는 안내 문구를 그려서
// 완전히 빈 DOM이 되는 순간이 없도록 한다.
export default function LoadingScreen({ message = "불러오는 중이에요..." }) {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "14px", color: "#8c96ae" }}>{message}</p>
    </div>
  );
}
