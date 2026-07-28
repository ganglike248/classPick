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
            최종 수정일: 2026년 7월 28일
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
              수집된 익명 데이터는 서비스 품질 개선, 오류 분석, 그리고 아래
              4항에서 설명하는 광고 게재에 활용됩니다. 개인을 식별할 수 있는
              정보를 제3자에게 판매하지 않습니다.
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

          <section style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              4. 광고 서비스 이용
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              본 사이트는 서비스 운영비 충당을 위해 <strong>카카오 애드핏(Kakao AdFit)</strong>,{" "}
              <strong>구글 애드센스(Google AdSense)</strong> 등 제3자 광고 서비스를
              이용해 광고를 게재할 수 있습니다. 이 과정에서 광고 사업자가 쿠키 등을
              이용해 기기 정보, 방문 기록 등을 자동으로 수집·이용할 수 있으며,
              이는 각 사업자의 개인정보처리방침이 적용됩니다.
            </p>
            <ul style={{ fontSize: "14px", color: "#374151", lineHeight: 1.9, paddingLeft: "20px", margin: "10px 0 0" }}>
              <li>
                구글의 광고 쿠키 사용 및 맞춤 광고 해제는{" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: "#478ef0" }}>
                  광고 설정
                </a>
                에서 관리할 수 있습니다.
              </li>
              <li>
                카카오 애드핏 관련 안내는{" "}
                <a href="https://adfit.kakao.com/terms/privacy" target="_blank" rel="noreferrer" style={{ color: "#478ef0" }}>
                  카카오 애드핏 개인정보처리방침
                </a>
                에서 확인할 수 있습니다.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e2532", marginBottom: "8px" }}>
              5. 데이터 보관 및 삭제
            </h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              로컬스토리지 데이터는 사용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
              Firebase에 저장된 랭킹 데이터 삭제를 원하시면 하단의 문의 채널로 연락해 주세요.
            </p>
          </section>

          <button
            className="btn"
            style={{ fontSize: "13px" }}
            onClick={() => navigate("/")}
          >
            홈 화면으로
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
