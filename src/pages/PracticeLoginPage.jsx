import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStoredState } from "../utils/storage";

// 시뮬레이션 시작 시각: 09:59:50 (초 단위)
const SIM_START_SECONDS = 9 * 3600 + 59 * 60 + 50; // 35990
const LOGIN_OPEN_SECONDS = 10 * 3600; // 36000 (10:00:00)

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
    // 저장된 state 확인
    const state = loadStoredState();
    if (!state) {
      alert("설정 정보를 찾을 수 없습니다.\n설정 페이지로 돌아가 다시 시작해 주세요.");
      navigate("/");
      return;
    }
    navigate("/register");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      {/* 시계 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #d0d2d8",
          padding: "20px 40px",
          textAlign: "center",
          minWidth: "340px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#555",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          현재 시각
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: isLoginOpen ? "#e54b4b" : "#222",
            letterSpacing: "2px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatSimTime(simSeconds)}
        </div>
        {!isLoginOpen && (
          <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            오전 10시 00분 00초부터 수강신청이 가능합니다
          </div>
        )}
        {isLoginOpen && (
          <div style={{ fontSize: "12px", color: "#e54b4b", marginTop: "8px", fontWeight: 600 }}>
            수강신청 가능 시간입니다
          </div>
        )}
      </div>

      {/* 로그인 폼 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #d0d2d8",
          padding: "24px 32px",
          minWidth: "340px",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          수강신청 시스템 로그인
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>학번</div>
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
            <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>비밀번호</div>
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
              marginTop: "8px",
              padding: "10px 0",
              backgroundColor: "rgb(71,142,240)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
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

      <button
        type="button"
        className="btn btn-sm"
        style={{ fontSize: "11px", color: "#999" }}
        onClick={() => navigate("/")}
      >
        ← 설정 화면으로 돌아가기
      </button>
    </div>
  );
}
