import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL = "business9498@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="footer">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>
          연습용 모의 시스템 · 교육 목적 전용
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px", lineHeight: 1.6 }}>
          본 사이트는 실제 대학교 시스템과 무관하며, 학습 목적으로 제작되었습니다.
          일부 데이터는 서비스 개선을 위해 Firebase에 익명으로 수집될 수 있습니다.
        </div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", marginBottom: "8px" }}>
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
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          문의 및 피드백:{" "}
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleCopyEmail}
            title="클릭하면 이메일 주소가 복사됩니다"
            style={{ color: copied ? "#22c55e" : "#6b9fe8", transition: "color 0.2s" }}
          >
            {copied ? "복사됨!" : EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
