import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
        <h1>개인정보처리방침</h1>

        <h2>1. 개인정보 수집 항목</h2>
        <p>
          본 사이트는 <strong>개인정보를 수집하지 않습니다.</strong> 모든
          데이터는 사용자 브라우저의 로컬스토리지에만 저장됩니다.
        </p>

        <h2>2. 제3자 제공</h2>
        <p>본 사이트는 개인정보를 제3자에게 제공하지 않습니다.</p>

        <h2>3. 데이터 보관</h2>
        <p>
          모든 데이터는 사용자 기기에만 저장되며, 서버에 전송되지 않습니다.
        </p>

        <p style={{ marginTop: "40px", color: "#999" }}>
          최종 수정일: 2026년 2월 6일
        </p>

        <p>
          <Link to="/" style={{ color: "#4285f4" }}>
            ← 메인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
