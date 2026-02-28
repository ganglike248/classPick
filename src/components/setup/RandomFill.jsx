import { useState } from "react";
import { generateRandomId, SAMPLE_NAMES } from "../../utils/courseUtils";

export default function RandomFill({ onFill, getAllIds }) {
  const [cartCount, setCartCount] = useState("3");
  const [regCount, setRegCount] = useState("3");

  const handleFill = () => {
    let cc = parseInt(cartCount, 10);
    let rc = parseInt(regCount, 10);
    if (Number.isNaN(cc) || cc < 0) cc = 0;
    if (Number.isNaN(rc) || rc < 0) rc = 0;
    if (cc > 20) cc = 20;
    if (rc > 20) rc = 20;

    const taken = getAllIds();

    try {
      const cartRows = [];
      const regRows = [];

      for (let i = 0; i < cc; i++) {
        const id = generateRandomId(taken);
        const name = SAMPLE_NAMES[i % SAMPLE_NAMES.length] + " (임의)";
        cartRows.push({ id, name, credit: 3 });
      }
      for (let i = 0; i < rc; i++) {
        const id = generateRandomId(taken);
        const name = SAMPLE_NAMES[(cc + i) % SAMPLE_NAMES.length] + " (임의)";
        regRows.push({ id, name, credit: 3 });
      }

      onFill(cartRows, regRows);
    } catch (e) {
      console.error(e);
      alert("임의 과목을 더 이상 생성할 수 없습니다.");
    }
  };

  return (
    <div
      style={{
        marginTop: "16px",
        borderTop: "1px dashed #e0e2e8",
        paddingTop: "10px",
      }}
    >
      <div className="login-panel__field-label">임의의 과목 넣기</div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "4px",
        }}
      >
        <span className="helper-text">수강꾸러미</span>
        <input
          type="number"
          className="input-text"
          value={cartCount}
          min={0}
          max={20}
          style={{ width: "60px", textAlign: "right" }}
          onChange={(e) => setCartCount(e.target.value)}
        />
        <span className="helper-text">개, 이미 신청된 과목</span>
        <input
          type="number"
          className="input-text"
          value={regCount}
          min={0}
          max={20}
          style={{ width: "60px", textAlign: "right" }}
          onChange={(e) => setRegCount(e.target.value)}
        />
        <span className="helper-text">개를 임의로 추가</span>
        <button type="button" className="btn btn-sm" onClick={handleFill}>
          임의의 과목 넣기
        </button>
      </div>
      <div className="helper-text">
        기존에 입력된 과목은 유지하면서, 중복되지 않는 연습용 과목들을 자동으로
        채웁니다. 학점은 3학점으로 설정됩니다.
      </div>
    </div>
  );
}
