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
      if (cartRows.length === 0) {
        alert("실전 모드를 사용하려면 수강꾸러미에 과목을 추가해 주세요.");
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
          <h1 className="login-panel__title">연습용 수강신청</h1>

          {/* 시작 버튼 - 주요 CTA */}
          <button
            className="btn btn-primary btn-block"
            style={{
              backgroundColor: "rgb(71, 142, 240)",
              color: "white",
              borderRadius: "5px",
              padding: "16px 0",
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
              borderTop: "1px solid #e8eaef",
              borderBottom: "1px solid #e8eaef",
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
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px dashed #e0e2e8",
            }}
          >
            <button
              className="btn btn-block"
              style={{
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
                padding: "10px 0",
                fontWeight: 600,
                borderRadius: "3px",
              }}
              onClick={() => navigate("/challenge")}
            >
              🏆 랭킹 도전 모드
            </button>
            <div className="helper-text" style={{ textAlign: "center", marginTop: "4px" }}>
              모든 사용자가 동일한 과목으로 경쟁합니다
            </div>
          </div>

          {/* 초기화 */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "1px dashed #e0e2e8",
            }}
          >
            <button
              className="btn btn-danger btn-block"
              style={{ borderRadius: "3px", padding: "6px 0", fontSize: "12px" }}
              onClick={handleReset}
            >
              과목 설정 초기화
            </button>
            <div className="helper-text" style={{ marginTop: "4px", textAlign: "center" }}>
              오류 발생 시 초기화 후 재시도해 주세요
            </div>
          </div>
        </section>

        {/* 오른쪽: 초기 과목 설정 */}
        <section className="card">
          <div className="section-title">초기 과목 설정</div>
          <ul className="helper-text" style={{ marginBottom: "10px", paddingLeft: "18px", lineHeight: 1.9 }}>
            <li><strong>수강꾸러미</strong> — 신청 버튼으로 신청할 과목</li>
            <li><strong>이미 신청된 과목</strong> — 시작 시 이미 등록된 상태인 과목</li>
            <li><strong>코드 입력 과목</strong> — 강좌번호를 직접 입력해야 신청되는 과목 (화면 미노출)</li>
          </ul>

          {/* 수강꾸러미 */}
          <div
            className="section-title"
            style={{
              fontSize: "14px",
              marginTop: "16px",
              borderTop: "1px dashed #e0e2e8",
              paddingTop: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            수강꾸러미
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
          <div className="section-title" style={{ fontSize: "14px", marginTop: "18px", display: "flex", alignItems: "center" }}>
            이미 신청된 과목
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

          {/* 코드 입력으로 추가할 과목 */}
          <div className="section-title" style={{ fontSize: "14px", marginTop: "18px", display: "flex", alignItems: "center" }}>
            코드 입력 과목
            {codeRows.length > 0 && (
              <span className="badge">{codeRows.length}과목</span>
            )}
          </div>
          <p className="helper-text" style={{ marginBottom: "10px" }}>
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
