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
              1. 수집 항목
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 <strong>식별 가능한 개인정보를 수집하지 않습니다.</strong>{" "}
              다만, 서비스 운영 목적으로 아래의 익명 데이터가 자동 수집될 수 있습니다.
            </p>
            <ul style={{ fontSize: "14px", color: "#374151", lineHeight: 1.9, paddingLeft: "20px", margin: "10px 0 0" }}>
              <li>접속 기기 정보(OS, 브라우저 종류 등) — 식별 불가 형태</li>
              <li>페이지 조회 및 이벤트 로그 — 개인 식별 정보 미포함</li>
              <li>랭킹 도전 모드 이용 시 닉네임 및 수강신청 결과</li>
            </ul>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              2. 수집 목적 및 이용
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              수집된 익명 데이터는 서비스 품질 개선 및 오류 분석에만 활용됩니다.
              제3자에게 판매하거나 광고 목적으로 사용하지 않습니다.
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              3. Firebase 사용
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 Google의 <strong>Firebase</strong> 서비스를 사용합니다.
              Firebase는 익명 사용 통계 및 랭킹 데이터를 수집·저장하며,
              Google의 개인정보처리방침의 적용을 받습니다.
              과목 설정 등 일반 사용 데이터는 사용자 기기의 로컬스토리지에만 저장됩니다.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              4. 데이터 보관 및 삭제
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              로컬스토리지 데이터는 사용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
              Firebase에 저장된 랭킹 데이터 삭제를 원하시면 하단의 문의 채널로 연락해 주세요.
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
