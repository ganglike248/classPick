import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";
import Modal from "../components/common/Modal";
import {
  CHALLENGE_CART_COURSES,
  CHALLENGE_CODE_COURSES,
  CHALLENGE_DIFFICULTY,
  CHALLENGE_MAX_CREDITS,
} from "../data/challengeData";
import { DIFFICULTY_CONFIGS } from "../utils/practiceUtils";
import { buildInitialState, saveState } from "../utils/storage";
import { auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";

export default function ChallengePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const diffConfig = DIFFICULTY_CONFIGS[CHALLENGE_DIFFICULTY];

  const handleStartClick = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요. (랭킹에 표시됩니다)");
      return;
    }
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    setIsLoading(true);

    try {
      // 익명 Firebase 로그인 (없으면 새로 생성)
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // 챌린지 과목으로 초기 state 구성
      const cartRows = CHALLENGE_CART_COURSES.map((c) => ({ ...c }));
      const codeRows = CHALLENGE_CODE_COURSES.map((c) => ({ ...c }));

      const practiceModeSettings = {
        type: "challenge",
        difficulty: CHALLENGE_DIFFICULTY,
        nickname: nickname.trim(),
        startedAt: null,
        courseDeadlines: null,
        courseTimings: {},
        challengeDocId: null,
      };

      const newState = buildInitialState(
        cartRows,
        [],
        codeRows,
        CHALLENGE_MAX_CREDITS,
        practiceModeSettings
      );
      saveState(newState);

      navigate("/practice-login");
    } catch (e) {
      console.error("챌린지 시작 실패:", e);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "700px" }}>
        {/* 헤더 */}
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            🏆 랭킹 도전 모드
          </div>
          <div className="helper-text">
            모든 참가자가 동일한 과목 · 동일한 조건으로 경쟁합니다
          </div>
        </div>

        {/* 과목 목록 */}
        <div className="card">
          <div className="section-title">수강꾸러미 과목 (클릭하여 신청)</div>
          <table className="data-table" style={{ width: "100%", marginBottom: "4px" }}>
            <thead>
              <tr>
                <th>강좌번호</th>
                <th>교과목명</th>
                <th>학점</th>
              </tr>
            </thead>
            <tbody>
              {CHALLENGE_CART_COURSES.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="text-left">{c.name}</td>
                  <td>{c.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="section-title" style={{ color: "#e54b4b" }}>
            코드 직접 입력 과목 ⚠️ 반드시 외워두세요!
          </div>
          <div className="helper-text" style={{ marginBottom: "8px", color: "#e54b4b" }}>
            시작 후에는 이 정보가 보이지 않습니다. 강좌번호를 메모해두세요.
          </div>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>강좌번호 (입력할 코드)</th>
                <th>교과목명</th>
                <th>학점</th>
              </tr>
            </thead>
            <tbody>
              {CHALLENGE_CODE_COURSES.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ fontSize: "14px", color: "#333" }}>{c.id}</strong>
                  </td>
                  <td className="text-left">{c.name}</td>
                  <td>{c.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 도전 조건 */}
        <div className="card">
          <div className="section-title">도전 조건</div>
          <table className="data-table info-table" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th style={{ textAlign: "left", width: "40%" }}>신청가능 학점</th>
                <td>{CHALLENGE_MAX_CREDITS}학점</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>난이도</th>
                <td>
                  {diffConfig.label} (과목당 {diffConfig.min}~{diffConfig.max}초 내 마감)
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>마감 표시</th>
                <td>신청 시도 시에만 알 수 있음 (표시 없음)</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>시간 기록</th>
                <td>Firebase 서버 기준 측정 (클라이언트 조작 불가)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 닉네임 + 시작 버튼 */}
        <div className="card">
          <div className="login-panel__field-label">닉네임 입력</div>
          <input
            type="text"
            className="input-text"
            maxLength={12}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="랭킹에 표시될 닉네임 (최대 12자)"
            style={{ width: "100%", marginBottom: "12px" }}
            onKeyDown={(e) => e.key === "Enter" && handleStartClick()}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-primary btn-block"
              style={{
                padding: "12px 0",
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
                fontSize: "14px",
                fontWeight: 600,
              }}
              onClick={handleStartClick}
              disabled={isLoading}
            >
              {isLoading ? "준비 중..." : "🏁 도전 시작"}
            </button>
            <button
              className="btn btn-sm"
              style={{ padding: "12px 16px" }}
              onClick={() => navigate("/ranking")}
            >
              랭킹 보기
            </button>
          </div>
          <button
            className="btn btn-sm"
            style={{ marginTop: "8px", fontSize: "11px", color: "#999" }}
            onClick={() => navigate("/")}
          >
            ← 설정 화면으로
          </button>
        </div>
      </main>
      <Footer variant="setup" />

      {showModal && (
        <Modal
          title="도전 시작 전 최종 확인"
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
          confirmText="도전 시작"
          cancelText="취소"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#fff3f3", padding: "10px", borderRadius: "4px" }}>
              <strong style={{ color: "#e54b4b" }}>코드 입력 과목 번호를 외우셨나요?</strong>
              <div style={{ marginTop: "6px" }}>
                {CHALLENGE_CODE_COURSES.map((c) => (
                  <div key={c.id} style={{ fontFamily: "monospace", fontSize: "14px" }}>
                    {c.id} ({c.name})
                  </div>
                ))}
              </div>
            </div>
            <ul style={{ margin: "0", paddingLeft: "18px", lineHeight: 1.9 }}>
              <li>시작하면 이 화면으로 돌아올 수 없습니다.</li>
              <li>로그인 대기 페이지에서 오전 10시에 입장합니다.</li>
              <li>시간 기록은 Firebase 서버로 측정됩니다.</li>
              <li>닉네임 <strong>{nickname.trim()}</strong>으로 랭킹에 등록됩니다.</li>
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
