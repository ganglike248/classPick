import { useNavigate } from "react-router-dom";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "720px" }}>
        <div className="card" style={{ padding: "32px 36px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e2532", marginTop: 0, marginBottom: "6px", letterSpacing: "-0.4px" }}>
            개인정보처리방침
          </h1>
          <div style={{ fontSize: "12px", color: "#8c96ae", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid #e6eaf3" }}>
            최종 수정일: 2026년 2월 6일
          </div>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              1. 개인정보 수집 항목
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 <strong>개인정보를 수집하지 않습니다.</strong> 모든
              데이터는 사용자 브라우저의 로컬스토리지에만 저장됩니다.
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              2. 제3자 제공
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 개인정보를 제3자에게 제공하지 않습니다.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              3. 데이터 보관
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              모든 데이터는 사용자 기기에만 저장되며, 서버에 전송되지 않습니다.
              단, 랭킹 도전 모드 이용 시 닉네임 및 성적 정보가 Firebase 서버에 저장될 수 있습니다.
            </p>
          </section>

          <button
            className="btn"
            style={{ fontSize: "13px" }}
            onClick={() => navigate(-1)}
          >
            돌아가기
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
