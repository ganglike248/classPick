import { Component } from "react";

// 예상치 못한 렌더링 오류가 나면 흰 화면 대신 자연스러운 안내 화면을 보여준다.
// 라우터 상태도 깨졌을 수 있으니, 복구는 React Router가 아니라 완전한 새로고침으로 처리한다.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("예상하지 못한 오류:", error, info);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          background: "#f5f7fd",
        }}
      >
        <div
          className="card"
          style={{ maxWidth: "380px", textAlign: "center", padding: "36px 28px", marginTop: 0 }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
            문제가 발생했어요
          </div>
          <div className="helper-text" style={{ marginBottom: "20px", lineHeight: 1.6 }}>
            일시적인 오류가 발생했어요. 홈 화면으로 돌아가서 다시 시도해 주세요.
          </div>
          <button
            type="button"
            className="btn btn-block"
            style={{
              backgroundColor: "#478ef0",
              color: "#fff",
              borderColor: "#478ef0",
              padding: "11px 0",
              borderRadius: "6px",
              fontWeight: 700,
            }}
            onClick={this.handleReload}
          >
            홈 화면으로
          </button>
        </div>
      </div>
    );
  }
}
