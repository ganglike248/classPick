import { useNavigate } from "react-router-dom";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "720px" }}>
        <div className="card" style={{ padding: "32px 36px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e2532", marginTop: 0, marginBottom: "6px", letterSpacing: "-0.4px" }}>
            이용약관
          </h1>
          <div style={{ fontSize: "12px", color: "#8c96ae", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid #e6eaf3" }}>
            최종 수정일: 2026년 2월 6일
          </div>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              제1조 (목적)
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 <strong>수강신청 연습</strong>을 위한 교육용 웹사이트입니다.
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              제2조 (면책사항)
            </h2>
            <ul style={{ fontSize: "14px", color: "#374151", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li>본 사이트는 특정 대학교의 공식 시스템이 아닙니다.</li>
              <li>본 사이트 이용으로 발생하는 모든 책임은 사용자에게 있습니다.</li>
              <li>실제 수강신청과 무관하며, 연습 목적으로만 사용해야 합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              제3조 (데이터 수집 및 이용)
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 서비스 개선을 위해 Firebase를 통해 <strong>익명의 사용 데이터</strong>를
              수집할 수 있습니다. 수집되는 데이터는 개인을 식별할 수 없는 형태이며,
              상업적 목적으로 이용되지 않습니다. 자세한 내용은 개인정보처리방침을 참고하세요.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              제4조 (지적재산권)
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트의 UI/UX는 일반적인 수강신청 시스템을 참고하여 제작되었으며,
              특정 기관의 저작물을 복제하지 않았습니다.
            </p>
          </section>

          <button
            className="btn"
            style={{ fontSize: "13px" }}
            onClick={() => navigate("/")}
          >
            돌아가기
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
