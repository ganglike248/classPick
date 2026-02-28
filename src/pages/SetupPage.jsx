import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";
import PresetManager from "../components/setup/PresetManager";
import CourseTable from "../components/setup/CourseTable";
import CourseAddForm from "../components/setup/CourseAddForm";
import RandomFill from "../components/setup/RandomFill";
import PracticeModeSetup from "../components/setup/PracticeModeSetup";
import Modal from "../components/common/Modal";
import {
  loadStoredState,
  buildInitialState,
  saveState,
  STORAGE_KEY,
} from "../utils/storage";
import { checkDuplicates, hasCourseId, getAllExistingIds } from "../utils/courseUtils";
import { DIFFICULTY_CONFIGS } from "../utils/practiceUtils";

function stateToRows(state) {
  if (!state) return { cartRows: [], regRows: [], codeRows: [] };

  const safeCredit = (c) => (c && typeof c.credit === "number" && c.credit > 0 ? c.credit : 3);
  const registeredSet = new Set(state.registeredCourseIds || []);

  const cartRows = (state.cartCourseIds || [])
    .filter((id) => !registeredSet.has(id))
    .map((id) => state.courses[id])
    .filter(Boolean)
    .map((c) => ({ id: c.id, name: c.name, credit: safeCredit(c) }));

  const regRows = (state.registeredCourseIds || [])
    .map((id) => state.courses[id])
    .filter(Boolean)
    .map((c) => ({ id: c.id, name: c.name, credit: safeCredit(c) }));

  const codeRows = (state.codeInputCourseIds || [])
    .map((id) => state.courses[id])
    .filter(Boolean)
    .map((c) => ({ id: c.id, name: c.name, credit: safeCredit(c) }));

  return { cartRows, regRows, codeRows };
}

export default function SetupPage() {
  const navigate = useNavigate();
  const stored = loadStoredState();
  const initialRows = stateToRows(stored);

  const [cartRows, setCartRows] = useState(initialRows.cartRows);
  const [regRows, setRegRows] = useState(initialRows.regRows);
  const [codeRows, setCodeRows] = useState(initialRows.codeRows);
  const [maxCredit, setMaxCredit] = useState(stored?.student?.maxCredits ?? 20);

  // 실전 모드 설정
  const [practiceEnabled, setPracticeEnabled] = useState(false);
  const [practiceDifficulty, setPracticeDifficulty] = useState("medium");
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const settersMap = { cart: setCartRows, reg: setRegRows, code: setCodeRows };

  function findSection(id, cart, reg, code) {
    if (cart.some((r) => r.id === id)) return "cart";
    if (reg.some((r) => r.id === id)) return "reg";
    if (code.some((r) => r.id === id)) return "code";
    return null;
  }

  const handleRemove = useCallback((id, section) => {
    settersMap[section]((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleMoveRow = useCallback(
    (row, targetSection) => {
      const src = findSection(row.id, cartRows, regRows, codeRows);
      if (!src || src === targetSection) return;
      settersMap[src]((prev) => prev.filter((r) => r.id !== row.id));
      settersMap[targetSection]((prev) => [
        ...prev,
        { id: row.id, name: row.name, credit: row.credit },
      ]);
    },
    [cartRows, regRows, codeRows]
  );

  const handleAdd = useCallback((course, target) => {
    settersMap[target]((prev) => [...prev, course]);
  }, []);

  const existsCheck = useCallback(
    (id) => hasCourseId(cartRows, regRows, codeRows, id),
    [cartRows, regRows, codeRows]
  );

  const handleRandomFill = useCallback((newCartRows, newCodeRows) => {
    setCartRows((prev) => [...prev, ...newCartRows]);
    setCodeRows((prev) => [...prev, ...newCodeRows]);
  }, []);

  const getAllIds = useCallback(
    () => getAllExistingIds([...cartRows, ...regRows, ...codeRows]),
    [cartRows, regRows, codeRows]
  );

  const getCurrentPreset = useCallback(
    () => ({ cartRows, regRows, codeRows, maxCredit }),
    [cartRows, regRows, codeRows, maxCredit]
  );

  const handleLoadPreset = useCallback((presetData) => {
    setCartRows(presetData.cartRows || []);
    setRegRows(presetData.regRows || []);
    setCodeRows(presetData.codeRows || []);
    setMaxCredit(presetData.maxCredit ?? 20);
  }, []);

  // 공통 유효성 검사 + state 저장
  function validateAndSave(practiceModeSettings) {
    const dupMsg = checkDuplicates(cartRows, regRows, codeRows);
    if (dupMsg) {
      alert(dupMsg);
      return false;
    }
    let mc = parseInt(maxCredit, 10);
    if (Number.isNaN(mc) || mc <= 0) {
      alert("신청가능 학점이 올바르지 않아 기본값 20학점으로 설정합니다.");
      mc = 20;
    }
    const newState = buildInitialState(cartRows, regRows, codeRows, mc, practiceModeSettings);
    saveState(newState);
    return true;
  }

  const handleEnter = () => {
    if (practiceEnabled) {
      if (cartRows.length === 0 && codeRows.length === 0) {
        alert("실전 모드를 사용하려면 수강꾸러미 또는 코드 입력 과목을 하나 이상 추가해 주세요.");
        return;
      }
      const practiceModeSettings = {
        type: "practice",
        difficulty: practiceDifficulty,
        startedAt: null,
        courseDeadlines: null,
        courseTimings: {},
        challengeDocId: null,
      };
      if (!validateAndSave(practiceModeSettings)) return;
      setShowPracticeModal(true);
    } else {
      if (!validateAndSave(null)) return;
      navigate("/register");
    }
  };

  const handleModalConfirm = () => {
    setShowPracticeModal(false);
    navigate("/practice-login");
  };

  const handleReset = () => {
    if (
      !confirm(
        "모든 저장된 수강신청 연습 데이터를 삭제하시겠습니까? 프리셋은 그대로 유지됩니다."
      )
    )
      return;
    localStorage.removeItem(STORAGE_KEY);
    setCartRows([]);
    setRegRows([]);
    setCodeRows([]);
    setMaxCredit(20);
  };

  const diffLabel = DIFFICULTY_CONFIGS[practiceDifficulty]?.label ?? "";
  const diffRange = DIFFICULTY_CONFIGS[practiceDifficulty];
  const cartTotalCredits = cartRows.reduce((sum, r) => sum + (r.credit ?? 3), 0);

  return (
    <>
      <TopBand />
      <main className="page-wrap login-layout">
        {/* 왼쪽: 입장 + 신청가능 학점 설정 */}
        <section className="card">
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h1 className="login-panel__title" style={{ margin: 0 }}>수강신청 연습</h1>
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  borderColor: "#22c55e",
                  borderRadius: "5px",
                  fontWeight: 600,
                }}
                onClick={() => setShowHelpModal(true)}
              >
                설명서
              </button>
            </div>
            <div style={{ fontSize: "12px", color: "#8c96ae" }}>과목을 설정하고 수강신청을 연습하세요</div>
          </div>

          {/* 시작 버튼 - 주요 CTA */}
          <button
            className="btn btn-primary btn-block"
            style={{
              backgroundColor: "#478ef0",
              color: "#fff",
              borderColor: "#478ef0",
              borderRadius: "6px",
              padding: "14px 0",
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "14px",
            }}
            onClick={handleEnter}
          >
            수강신청 시작하기
          </button>

          {/* 신청가능 학점 - 인라인 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              borderTop: "1px solid #e6eaf3",
              borderBottom: "1px solid #e6eaf3",
            }}
          >
            <span className="login-panel__field-label" style={{ margin: 0, whiteSpace: "nowrap" }}>
              신청가능 학점
            </span>
            <input
              type="number"
              className="input-text"
              value={maxCredit}
              min={1}
              max={30}
              style={{ width: "60px", textAlign: "right" }}
              onChange={(e) => setMaxCredit(e.target.value)}
            />
            <span className="helper-text">학점 (기본 20)</span>
          </div>

          {/* 실전 모드 설정 */}
          <PracticeModeSetup
            enabled={practiceEnabled}
            onToggle={() => setPracticeEnabled((v) => !v)}
            difficulty={practiceDifficulty}
            onDifficultyChange={setPracticeDifficulty}
          />

          <PresetManager getCurrentPreset={getCurrentPreset} onLoad={handleLoadPreset} />

          {/* 랭킹 도전 모드 */}
          <div
            style={{
              marginTop: "14px",
              paddingTop: "14px",
              borderTop: "1px solid #e6eaf3",
            }}
          >
            <button
              className="btn btn-block"
              style={{
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
                padding: "11px 0",
                fontWeight: 700,
                borderRadius: "6px",
                fontSize: "13px",
              }}
              onClick={() => navigate("/challenge")}
            >
              🏆 랭킹 도전 모드
            </button>
            <div className="helper-text" style={{ textAlign: "center", marginTop: "5px" }}>
              모든 사용자가 동일한 과목으로 경쟁합니다
            </div>
          </div>

          {/* 초기화 */}
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #e6eaf3",
            }}
          >
            <button
              className="btn btn-danger btn-block"
              style={{ borderRadius: "6px", padding: "7px 0", fontSize: "12px" }}
              onClick={handleReset}
            >
              과목 설정 초기화
            </button>
            <div className="helper-text" style={{ marginTop: "5px", textAlign: "center" }}>
              오류 발생 시 초기화 후 재시도해 주세요
            </div>
          </div>
        </section>

        {/* 오른쪽: 초기 과목 설정 */}
        <section className="card">
          <div style={{ marginBottom: "14px" }}>
            <div className="section-title">초기 과목 설정</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div className="helper-text">
                <strong style={{ color: "#374151" }}>수강꾸러미</strong> — 신청 버튼으로 신청할 과목
              </div>
              <div className="helper-text">
                <strong style={{ color: "#374151" }}>이미 신청된 과목</strong> — 시작 시 이미 등록된 상태인 과목
              </div>
              <div className="helper-text">
                <strong style={{ color: "#374151" }}>코드 입력 과목</strong> — 강좌번호를 직접 입력해야 신청되는 과목 (화면 미노출)
              </div>
            </div>
          </div>

          {/* 수강꾸러미 */}
          <div
            style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid #e6eaf3",
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e2532" }}>수강꾸러미</span>
            {cartRows.length > 0 && (
              <span className="badge">{cartRows.length}과목</span>
            )}
          </div>
          <CourseTable
            rows={cartRows}
            section="cart"
            onMove={handleMoveRow}
            onRemove={handleRemove}
          />

          {/* 이미 신청된 과목 */}
          <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #e6eaf3", display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e2532" }}>이미 신청된 과목</span>
            {regRows.length > 0 && (
              <span className="badge">{regRows.length}과목</span>
            )}
          </div>
          <CourseTable
            rows={regRows}
            section="reg"
            onMove={handleMoveRow}
            onRemove={handleRemove}
          />

          {/* 코드 입력 과목 */}
          <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #e6eaf3", display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e2532" }}>코드 입력 과목</span>
            {codeRows.length > 0 && (
              <span className="badge">{codeRows.length}과목</span>
            )}
          </div>
          <p className="helper-text" style={{ marginBottom: "8px", marginTop: "4px" }}>
            화면에 표시되지 않으며, 강좌번호를 직접 입력해야 신청됩니다. 학점 제한에 포함됩니다.
          </p>
          <CourseTable
            rows={codeRows}
            section="code"
            onMove={handleMoveRow}
            onRemove={handleRemove}
          />

          <CourseAddForm onAdd={handleAdd} existsCheck={existsCheck} />
          <RandomFill onFill={handleRandomFill} getAllIds={getAllIds} />
        </section>
      </main>
      <Footer variant="setup" />

      {/* 도움말 모달 */}
      {showHelpModal && (
        <Modal
          title="서비스 도움말"
          onConfirm={() => setShowHelpModal(false)}
          confirmText="닫기"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "13px", color: "#374151", lineHeight: 1.8 }}>

            {/* 1. 서비스 소개 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                이 서비스는 무엇인가요?
              </div>
              <p style={{ margin: 0 }}>
                대학교 수강신청을 미리 연습할 수 있는 <strong>모의 수강신청 시스템</strong>입니다.
                실제 수강신청처럼 과목을 설정하고, 캡차 인증 후 신청하는 전 과정을 체험할 수 있어요.
                처음 수강신청을 앞둔 신입생이나, 빠른 신청 속도를 키우고 싶은 분께 유용합니다.
              </p>
            </section>

            {/* 2. 기본 사용법 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                기본 사용법 (3단계)
              </div>
              <ol style={{ margin: 0, paddingLeft: "18px" }}>
                <li style={{ marginBottom: "4px" }}><strong>과목 설정</strong> — 오른쪽 패널에서 신청할 과목을 추가합니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>수강신청 시작</strong> — 왼쪽의 파란 버튼을 눌러 수강신청 화면으로 이동합니다.</li>
                <li><strong>과목 신청</strong> — 캡차 인증 후 원하는 과목을 클릭하여 신청합니다.</li>
              </ol>
            </section>

            {/* 3. 과목 설정 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                과목 설정 — 세 가지 유형
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ background: "#f0f7ff", border: "1px solid #c3daf9", borderLeft: "4px solid #478ef0", borderRadius: "4px", padding: "10px 12px" }}>
                  <strong>수강꾸러미</strong><br />
                  수강신청 화면에 목록으로 표시되는 과목입니다. 옆의 [신청] 버튼을 클릭하면 신청됩니다. 실제 수강신청 시 미리 담아두는 "수강꾸러미"와 동일한 개념입니다.
                </div>
                <div style={{ background: "#f0f7ff", border: "1px solid #c3daf9", borderLeft: "4px solid #478ef0", borderRadius: "4px", padding: "10px 12px" }}>
                  <strong>이미 신청된 과목</strong><br />
                  연습 시작 시점에 이미 신청이 완료된 상태로 설정됩니다. 미리 신청해 둔 과목이 있는 상황을 재현하고 싶을 때 사용합니다.
                </div>
                <div style={{ background: "#fff8f8", border: "1px solid #fac5c5", borderLeft: "4px solid #e54b4b", borderRadius: "4px", padding: "10px 12px" }}>
                  <strong>코드 입력 과목</strong><br />
                  화면에 표시되지 않는 과목입니다. 수강신청 화면 하단의 [강좌번호 직접 입력] 칸에 강좌번호를 직접 입력해야만 신청됩니다. 수강꾸러미에 없는 과목을 번호로 신청하는 연습에 활용하세요.
                </div>
              </div>
            </section>

            {/* 4. 수강신청 화면 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                수강신청 화면 사용법
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                <li style={{ marginBottom: "4px" }}><strong>캡차 인증</strong> — 화면에 표시된 숫자를 입력 칸에 그대로 입력하세요. 신청 또는 삭제 후마다 새로운 숫자가 나타납니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>과목 신청</strong> — 캡차 인증을 완료한 상태에서 [신청] 버튼을 클릭합니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>신청 취소</strong> — 하단 [신청 과목 목록]에서 삭제 버튼으로 취소할 수 있습니다.</li>
                <li><strong>학점 한도</strong> — 설정한 신청가능 학점을 초과하면 신청이 거부됩니다.</li>
              </ul>
            </section>

            {/* 5. 실전 모드 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                실전 모드란?
              </div>
              <p style={{ margin: "0 0 8px" }}>
                실제 수강신청 환경을 그대로 재현한 모드입니다. 왼쪽 패널에서 <strong>[실전 모드]</strong> 토글을 켜고 시작하세요.
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                <li style={{ marginBottom: "4px" }}><strong>로그인 대기</strong> — 입장하면 오전 10시까지 기다리는 대기 화면이 나타납니다. 10시가 되는 순간 빠르게 클릭하세요.</li>
                <li style={{ marginBottom: "4px" }}><strong>흰 화면</strong> — 입장 직후 잠깐 흰 화면이 보입니다. 실제 수강신청 서버 부하를 재현한 것으로, 당황하지 말고 기다리면 됩니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>과목 마감</strong> — 각 과목은 무작위 시간에 자동으로 마감됩니다. 마감된 과목은 신청이 불가합니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>난이도</strong> — 쉬움/보통/어려움으로 마감 시간이 달라집니다. 어려울수록 더 빨리 마감됩니다.</li>
                <li><strong>자동 종료</strong> — 모든 과목이 신청 완료되거나 마감되면 자동으로 결과 화면으로 이동합니다.</li>
              </ul>
            </section>

            {/* 6. 랭킹 도전 모드 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #e54b4b" }}>
                랭킹 도전 모드란?
              </div>
              <p style={{ margin: "0 0 8px" }}>
                모든 사용자가 <strong>동일한 과목 세트</strong>로 도전하는 경쟁 모드입니다.
                결과가 서버에 저장되어 랭킹 페이지에서 다른 사용자와 순위를 비교할 수 있습니다.
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                <li style={{ marginBottom: "4px" }}>별도 설정 없이 [🏆 랭킹 도전 모드] 버튼으로 바로 시작합니다.</li>
                <li style={{ marginBottom: "4px" }}>닉네임을 입력하면 랭킹에 이름이 표시됩니다.</li>
                <li><strong>모든 과목을 전부 신청 성공</strong>해야만 랭킹에 기록됩니다. 하나라도 마감되어 놓치면 기록되지 않습니다.</li>
              </ul>
            </section>

            {/* 7. 편의 기능 */}
            <section>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e2532", marginBottom: "6px", paddingBottom: "5px", borderBottom: "2px solid #478ef0" }}>
                편의 기능
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                <li style={{ marginBottom: "4px" }}><strong>랜덤 채우기</strong> — 과목 이름과 학점을 자동으로 생성해 채웁니다. 빠르게 연습 환경을 구성할 때 유용합니다.</li>
                <li style={{ marginBottom: "4px" }}><strong>프리셋 저장/불러오기</strong> — 자주 쓰는 과목 세트를 이름을 붙여 저장해 두고 언제든 불러올 수 있습니다.</li>
                <li><strong>과목 이동</strong> — 테이블의 [이동] 버튼으로 과목을 수강꾸러미 ↔ 이미 신청된 과목 ↔ 코드 입력 과목 사이에서 옮길 수 있습니다.</li>
              </ul>
            </section>

            <div style={{ background: "#f5f7fd", border: "1px solid #e6eaf3", borderRadius: "6px", padding: "10px 12px", fontSize: "12px", color: "#8c96ae" }}>
              본 사이트는 교육 목적의 연습용 서비스로, 실제 대학교 시스템과 무관합니다.
              문의사항은 하단 푸터의 이메일로 연락해 주세요.
            </div>
          </div>
        </Modal>
      )}

      {/* 실전 모드 안내 모달 */}
      {showPracticeModal && (
        <Modal
          title="실전 모드 시작 전 확인사항"
          onConfirm={handleModalConfirm}
          onCancel={() => setShowPracticeModal(false)}
          confirmText="시작하기"
          cancelText="취소"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#f5f5f7", padding: "10px", borderRadius: "4px" }}>
              <strong>현재 설정 요약</strong>
              <table style={{ marginTop: "8px", width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#666", paddingBottom: "3px", width: "40%" }}>수강꾸러미</td>
                    <td style={{ fontWeight: 600 }}>{cartRows.length}개 ({cartTotalCredits}학점)</td>
                  </tr>
                  {codeRows.length > 0 && (
                    <tr>
                      <td style={{ color: "#666", paddingBottom: "3px" }}>코드 입력 과목</td>
                      <td style={{ fontWeight: 600 }}>{codeRows.length}개</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ color: "#666", paddingBottom: "3px" }}>신청가능 학점</td>
                    <td style={{ fontWeight: 600 }}>{maxCredit}학점</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#666", paddingBottom: "3px" }}>난이도</td>
                    <td style={{ fontWeight: 600 }}>{diffLabel} (과목당 {diffRange?.min}~{diffRange?.max}초 내 마감)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <strong>진행 방식</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px", lineHeight: 1.9 }}>
                <li>로그인 대기 페이지에서 <strong>오전 10시</strong>가 되면 입장할 수 있습니다.</li>
                <li>
                  입장 직후 <strong>흰 화면이 잠시 보입니다</strong> — 실제 수강신청 환경을
                  고증한 것으로, <strong>당황하지 말고 잠시 대기</strong>하면 됩니다.
                </li>
                <li>
                  각 과목은 <strong>설정한 난이도에 따른 무작위 시간에 마감</strong>됩니다.
                  마감 여부는 직접 신청해봐야 알 수 있습니다.
                </li>
                <li>
                  수강꾸러미의 모든 과목이 신청 완료되거나 마감되면{" "}
                  <strong>자동으로 결과 화면으로 이동</strong>합니다.
                </li>
              </ul>
            </div>

            <div className="helper-text" style={{ color: "#777" }}>
              ※ 결과는 완료 직후 한 번만 확인 가능합니다.
              다른 사람과 경쟁하려면 <strong>랭킹 도전 모드</strong>를 이용하세요.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
