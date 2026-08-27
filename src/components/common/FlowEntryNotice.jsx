import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBand from "../layout/TopBand";
import Footer from "../layout/Footer";

// /register, /result 처럼 앱 흐름(설정 → 로그인 대기 → 수강신청) 안에서만
// 도달하는 화면에, 필요한 상태 없이 직접 들어왔을 때 보여주는 안내 화면.
//
// 예전에는 이 경우 곧바로 navigate("/") 로 튕겼는데, 그 즉시 리디렉트가
// 애드센스 정책의 "이동·행동 목적으로만 쓰이는 화면"에 해당해 심사에서
// 걸렸다. 이제는 자동 이동 없이 "이 화면이 무엇이고 어떻게 들어오는지"를
// 설명하는 실제 콘텐츠를 그린다. 색인은 필요 없으므로 noindex 처리한다.
export default function FlowEntryNotice({ title, lead, steps }) {
  const navigate = useNavigate();

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "640px" }}>
        <div className="card" style={{ padding: "32px 36px" }}>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: "-0.4px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: 1.8,
              margin: "0 0 20px",
              paddingBottom: "18px",
              borderBottom: "1px solid #e6eaf3",
            }}
          >
            {lead}
          </p>

          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
            이 화면까지 오는 순서
          </div>
          <ol
            style={{
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: 1.9,
              paddingLeft: "20px",
              margin: "0 0 24px",
            }}
          >
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          <button
            className="btn btn-primary"
            style={{
              padding: "11px 24px",
              backgroundColor: "#478ef0",
              color: "#fff",
              borderColor: "#478ef0",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "6px",
            }}
            onClick={() => navigate("/")}
          >
            홈으로 가서 시작하기
          </button>

          <p style={{ fontSize: "13px", color: "#8c96ae", marginTop: "16px" }}>
            수강신청 준비와 연습 방법은{" "}
            <a href="/guide" style={{ color: "#478ef0" }}>
              수강신청 가이드
            </a>
            를, 서비스 설명은{" "}
            <a href="/about" style={{ color: "#478ef0" }}>
              소개 페이지
            </a>
            를 참고하세요.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
