import { generateRandomId, SAMPLE_NAMES } from "../../utils/courseUtils";

export default function RandomFill({ onFill, getAllIds }) {
  const handleFill = () => {
    const taken = getAllIds();

    try {
      const cartRows = [];
      const codeRows = [];

      const shuffled = [...SAMPLE_NAMES].sort(() => Math.random() - 0.5);
      for (let i = 0; i < 3; i++) {
        const id = generateRandomId(taken);
        cartRows.push({ id, name: shuffled[i], credit: 3 });
      }
      for (let i = 0; i < 3; i++) {
        const id = generateRandomId(taken);
        codeRows.push({ id, name: shuffled[3 + i], credit: 3 });
      }

      onFill(cartRows, codeRows);
    } catch (e) {
      console.error(e);
      alert("임의 과목을 생성할 수 없습니다.");
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
      <button type="button" className="btn btn-sm" style={{ width: "100%", marginBottom: "4px" }} onClick={handleFill}>
        임의의 과목 넣기 (수강꾸러미 3 · 코드 입력 3)
      </button>
      <div className="helper-text">
        기존에 입력된 과목은 유지하면서, 중복되지 않는 연습용 과목을 자동으로 채웁니다.
      </div>
    </div>
  );
}
