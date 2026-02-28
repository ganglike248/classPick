import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStoredState } from "../utils/storage";

const SIM_START_SECONDS = 9 * 3600 + 59 * 60 + 50;
const LOGIN_OPEN_SECONDS = 10 * 3600;

function formatSimTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const ampm = h < 12 ? "오전" : "오후";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${ampm} ${String(displayH).padStart(2, "0")}시 ${String(m).padStart(2, "0")}분 ${String(s).padStart(2, "0")}초`;
}

export default function PracticeLoginPage() {
  const navigate = useNavigate();
  const [simSeconds, setSimSeconds] = useState(SIM_START_SECONDS);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSimSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const isLoginOpen = simSeconds >= LOGIN_OPEN_SECONDS;

  const handleLogin = () => {
    if (!isLoginOpen) {
      alert("수강신청이 가능한 기간이 아닙니다.\n오전 10시 00분 00초 이후에 로그인하세요.");
      return;
    }
    const state = loadStoredState();
    if (!state) {
      alert("설정 정보를 찾을 수 없습니다.\n설정 페이지로 돌아가 다시 시작해 주세요.");
      navigate("/");
      return;
    }
    navigate("/register");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f2f4f9", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <header style={{ background: "#1a2235", borderBottom: "1px solid #111827" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", height: "58px", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>수강신청 연습</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginLeft: "10px" }}>모의 연습 시스템</span>
        </div>
      </header>

      {/* 본문 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          {/* 타이틀 */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1e2532", marginBottom: "6px", letterSpacing: "-0.4px" }}>
              수강신청 시스템 로그인
            </div>
            <div style={{ fontSize: "13px", color: "#8c96ae" }}>
              오전 10시 이후 로그인이 가능합니다
            </div>
          </div>

          {/* 시계 카드 */}
          <div style={{ background: "#fff", border: "1px solid #e6eaf3", borderRadius: "10px", padding: "22px 28px", textAlign: "center", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              현재 시각
            </div>
            <div style={{ fontSize: "30px", fontWeight: 700, color: isLoginOpen ? "#e54b4b" : "#1e2532", letterSpacing: "0.5px", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {formatSimTime(simSeconds)}
            </div>
            <div style={{ marginTop: "12px" }}>
              <span style={{
                display: "inline-block",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 14px",
                borderRadius: "20px",
                background: isLoginOpen ? "#fef2f2" : "#f2f4f9",
                color: isLoginOpen ? "#e54b4b" : "#8c96ae",
              }}>
                {isLoginOpen ? "수강신청 가능" : "대기 중"}
              </span>
            </div>
          </div>

          {/* 로그인 카드 */}
          <div style={{ background: "#fff", border: "1px solid #e6eaf3", borderRadius: "10px", padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", fontWeight: 600 }}>학번</div>
                <input
                  type="text"
                  className="input-text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="학번을 입력하세요"
                  style={{ width: "100%" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", fontWeight: 600 }}>비밀번호</div>
                <input
                  type="password"
                  className="input-text"
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  style={{ width: "100%" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{
                  marginTop: "2px",
                  padding: "11px 0",
                  backgroundColor: isLoginOpen ? "#478ef0" : "#a0b4cc",
                  color: "#fff",
                  borderColor: isLoginOpen ? "#478ef0" : "#a0b4cc",
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: "6px",
                }}
                onClick={handleLogin}
              >
                로그인
              </button>
            </div>
            <div className="helper-text" style={{ marginTop: "12px", textAlign: "center" }}>
              입력값과 무관하게 오전 10시 이후에 로그인됩니다
            </div>
          </div>

          {/* 뒤로가기 */}
          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#8c96ae", padding: "4px 8px" }}
              onClick={() => navigate("/")}
            >
              설정 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
