import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>
          연습용 모의 시스템 · 교육 목적 전용
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px", lineHeight: 1.6 }}>
          본 사이트는 실제 대학교 시스템과 무관하며, 학습 목적으로 제작되었습니다.
          모든 데이터는 브라우저 로컬스토리지에만 저장됩니다.
        </div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}>
          <Link to="/privacy" style={{ color: "#6b9fe8", fontSize: "11px" }}>
            개인정보처리방침
          </Link>
          <span style={{ color: "#d1d5db" }}>·</span>
          <Link to="/terms" style={{ color: "#6b9fe8", fontSize: "11px" }}>
            이용약관
          </Link>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span style={{ fontSize: "11px" }}>© 2026 Course Practice. Educational Use Only.</span>
        </div>
      </div>
    </footer>
  );
}
