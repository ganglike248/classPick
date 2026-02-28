import { Link } from "react-router-dom";

export default function Footer({ variant = "setup" }) {
  return (
    <footer
      className="footer"
      style={{
        padding: "20px 16px",
        background: "#f8f9fa",
        borderTop: "1px solid #e0e2e8",
        fontSize: "12px",
        color: "#555",
        lineHeight: "1.6",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <strong style={{ fontSize: "13px" }}>
          ⚠️ 연습용 모의 시스템 · 교육 목적 웹사이트{variant === "setup" ? " ⚠️" : ""}
        </strong>
        <ul
          style={{
            margin: "8px 0 12px 0",
            paddingLeft: variant === "setup" ? "0" : "20px",
            textAlign: variant === "setup" ? "center" : "left",
            listStyle: variant === "setup" ? "none" : undefined,
          }}
        >
          <li>
            본 사이트는 <strong>실제 대학교 시스템과 무관</strong>하며, 일반적인
            수강신청 인터페이스를 참고하여{" "}
            <strong>학습/연습 목적</strong>으로 제작되었습니다.
          </li>
          <li>
            모든 데이터는 사용자 브라우저 로컬스토리지에만 저장되며,{" "}
            <strong>개인정보를 수집하지 않습니다.</strong>
          </li>
          <li>
            본 사이트는 특정 대학/기관의 공식 서비스가 아니며, 실제
            수강신청에 사용할 수 없습니다.
          </li>
        </ul>
        <div
          style={{
            paddingTop: "8px",
            borderTop: "1px solid #ddd",
            marginTop: "8px",
          }}
        >
          <Link
            to="/privacy"
            style={{
              color: "#4285f4",
              textDecoration: "none",
              marginRight: "12px",
            }}
          >
            개인정보처리방침
          </Link>
          <Link
            to="/terms"
            style={{
              color: "#4285f4",
              textDecoration: "none",
              marginRight: "12px",
            }}
          >
            이용약관
          </Link>
          <span style={{ color: "#999" }}>
            © 2026 Course Practice. Educational Use Only.
          </span>
        </div>
      </div>
    </footer>
  );
}
