import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";
import PresetManager from "../components/setup/PresetManager";
import CourseTable from "../components/setup/CourseTable";
import CourseAddForm from "../components/setup/CourseAddForm";
import RandomFill from "../components/setup/RandomFill";
import {
  loadStoredState,
  buildInitialState,
  saveState,
  STORAGE_KEY,
} from "../utils/storage";
import { checkDuplicates, hasCourseId, getAllExistingIds } from "../utils/courseUtils";

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
  const [maxCredit, setMaxCredit] = useState(
    stored?.student?.maxCredits ?? 20
  );

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

  const handleMoveRow = useCallback((row, targetSection) => {
    const src = findSection(row.id, cartRows, regRows, codeRows);
    if (!src || src === targetSection) return;
    settersMap[src]((prev) => prev.filter((r) => r.id !== row.id));
    settersMap[targetSection]((prev) => [
      ...prev,
      { id: row.id, name: row.name, credit: row.credit },
    ]);
  }, [cartRows, regRows, codeRows]);

  const handleAdd = useCallback((course, target) => {
    settersMap[target]((prev) => [...prev, course]);
  }, []);

  const existsCheck = useCallback((id) => {
    return hasCourseId(cartRows, regRows, codeRows, id);
  }, [cartRows, regRows, codeRows]);

  const handleRandomFill = useCallback((newCartRows, newRegRows) => {
    setCartRows((prev) => [...prev, ...newCartRows]);
    setRegRows((prev) => [...prev, ...newRegRows]);
  }, []);

  const getAllIds = useCallback(() => {
    return getAllExistingIds([...cartRows, ...regRows, ...codeRows]);
  }, [cartRows, regRows, codeRows]);

  const getCurrentPreset = useCallback(() => {
    return { cartRows, regRows, codeRows, maxCredit };
  }, [cartRows, regRows, codeRows, maxCredit]);

  const handleLoadPreset = useCallback((presetData) => {
    setCartRows(presetData.cartRows || []);
    setRegRows(presetData.regRows || []);
    setCodeRows(presetData.codeRows || []);
    setMaxCredit(presetData.maxCredit ?? 20);
  }, []);

  const handleEnter = () => {
    const dupMsg = checkDuplicates(cartRows, regRows, codeRows);
    if (dupMsg) {
      alert(dupMsg);
      return;
    }

    let mc = parseInt(maxCredit, 10);
    if (Number.isNaN(mc) || mc <= 0) {
      alert("신청가능 학점이 올바르지 않아 기본값 20학점으로 설정합니다.");
      mc = 20;
    }

    const newState = buildInitialState(cartRows, regRows, codeRows, mc);
    saveState(newState);
    navigate("/register");
  };

  const handleReset = () => {
    if (!confirm("모든 저장된 수강신청 연습 데이터를 삭제하시겠습니까? 프리셋은 그대로 유지됩니다.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setCartRows([]);
    setRegRows([]);
    setCodeRows([]);
    setMaxCredit(20);
  };

  return (
    <>
      <TopBand />
      <main className="page-wrap login-layout">
        {/* 왼쪽: 입장 + 신청가능 학점 설정 */}
        <section className="card">
          <h1 className="login-panel__title">연습용 수강신청 입장</h1>

          <div style={{ marginBottom: "12px" }}>
            <div className="login-panel__field-label">연습용 계정</div>
            <div className="helper-text">
              실제 계정이 필요 없고, 아래 버튼만 누르면 수강신청 화면으로 이동합니다.
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            style={{
              marginBottom: "8px",
              backgroundColor: "rgb(71, 142, 240)",
              color: "white",
              borderRadius: "5px",
              padding: "20px 0",
            }}
            onClick={handleEnter}
          >
            수강신청 시작하기
          </button>

          <button
            className="btn btn-danger btn-block"
            style={{ marginTop: "4px", borderRadius: "5px" }}
            onClick={handleReset}
          >
            과목 설정 초기화
          </button>

          <div className="login-panel__stored">
            알 수 없는 오류가 발생할 경우, '모든 데이터 초기화' 버튼을 누르고 다시 시도 해주세요.
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderRadius: "5px",
                borderTop: "1px dashed #e0e2e8",
              }}
              className="login-panel__field-label"
            >
              신청가능 학점
            </div>
            <input
              type="number"
              className="input-text"
              value={maxCredit}
              min={1}
              max={30}
              style={{ width: "60px", textAlign: "right" }}
              onChange={(e) => setMaxCredit(e.target.value)}
            />
            <span className="helper-text"> 학점 (기본값 20)</span>
          </div>

          <PresetManager
            getCurrentPreset={getCurrentPreset}
            onLoad={handleLoadPreset}
          />
        </section>

        {/* 오른쪽: 초기 과목 설정 */}
        <section className="card">
          <div className="section-title">초기 과목 설정</div>
          <p className="helper-text" style={{ marginBottom: "10px" }}>
            연습에 사용할 강좌번호, 교과목명, 학점을 직접 입력해 주세요. 위는{" "}
            <strong>수강꾸러미</strong>, 그 아래는{" "}
            <strong>이미 신청된 과목</strong>, 마지막은{" "}
            <strong>코드 입력으로 추가할 과목</strong>입니다. 같은 강좌번호는
            서로 다른 섹션에 겹치지 않게 해 주세요.
          </p>

          {/* 수강꾸러미 */}
          <div
            className="section-title"
            style={{
              fontSize: "14px",
              marginTop: "16px",
              borderTop: "1px dashed #e0e2e8",
              paddingTop: "10px",
            }}
          >
            수강꾸러미
          </div>
          <CourseTable
            rows={cartRows}
            section="cart"
            onMove={handleMoveRow}
            onRemove={handleRemove}
          />

          {/* 이미 신청된 과목 */}
          <div
            className="section-title"
            style={{ fontSize: "14px", marginTop: "18px" }}
          >
            이미 신청된 과목
          </div>
          <CourseTable
            rows={regRows}
            section="reg"
            onMove={handleMoveRow}
            onRemove={handleRemove}
          />

          {/* 코드 입력으로 추가할 과목 */}
          <div
            className="section-title"
            style={{ fontSize: "14px", marginTop: "18px" }}
          >
            코드 입력으로 추가할 과목
          </div>
          <p className="helper-text" style={{ marginBottom: "10px" }}>
            <strong>신청 가능한 학점을 제한</strong>하기 위해 입력합니다.
            수강신청 단계에서는{" "}
            <strong>해당 과목을 신청하기 전까지는 보여지지 않습니다.</strong>
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
    </>
  );
}
