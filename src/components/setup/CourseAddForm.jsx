import { useRef, useState } from "react";

export default function CourseAddForm({ onAdd, existsCheck }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const nameRef = useRef(null);
  const creditRef = useRef(null);

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [name, setName] = useState("");
  const [credit, setCredit] = useState("3");
  const [target, setTarget] = useState("cart");

  const handleAdd = () => {
    const f = front.trim();
    const b = back.trim();
    const n = name.trim();
    let c = parseInt(credit, 10);

    if (!f || !b || !n) {
      alert("과목번호(앞 5자리, 뒤 2자리)와 교과목명을 모두 입력해 주세요.");
      return;
    }
    if (!/^\d{5}$/.test(f) || !/^\d{2}$/.test(b)) {
      alert("강좌번호 형식이 올바르지 않습니다. (예: 12345-01)");
      return;
    }
    if (Number.isNaN(c) || c <= 0) c = 3;

    const id = `${f}-${b}`;
    if (existsCheck(id)) {
      alert("이미 입력된 강좌번호입니다. (서로 다른 섹션 간 중복 불가)");
      return;
    }

    onAdd({ id, name: n, credit: c }, target);
    setFront("");
    setBack("");
    setName("");
    setCredit("3");
    frontRef.current?.focus();
  };

  return (
    <div style={{ marginTop: "16px", borderTop: "1px dashed #e0e2e8", paddingTop: "10px" }}>
      <div className="login-panel__field-label">과목 추가</div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "6px",
          padding: "0 8px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="helper-text">과목번호</span>
          <input
            ref={frontRef}
            type="text"
            className="input-text"
            maxLength={5}
            style={{ width: "90px", textAlign: "center" }}
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && backRef.current?.focus()}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="helper-text">&nbsp;</span>
          <input
            ref={backRef}
            type="text"
            className="input-text"
            maxLength={2}
            style={{ width: "60px", textAlign: "center" }}
            value={back}
            onChange={(e) => setBack(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && nameRef.current?.focus()}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
            minWidth: "160px",
          }}
        >
          <span className="helper-text">교과목명</span>
          <input
            ref={nameRef}
            type="text"
            className="input-text"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && creditRef.current?.focus()}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="helper-text">학점</span>
          <input
            ref={creditRef}
            type="number"
            className="input-text"
            value={credit}
            min={1}
            max={6}
            style={{ width: "70px", textAlign: "right" }}
            onChange={(e) => setCredit(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="helper-text">추가 위치</span>
          <select
            className="input-text"
            style={{ width: "120px" }}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="cart">수강꾸러미</option>
            <option value="reg">이미 신청된 과목</option>
            <option value="code">코드 입력용 과목</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-start",
          }}
        >
          <span className="helper-text">&nbsp;</span>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: "rgb(71, 142, 240)", color: "white" }}
            onClick={handleAdd}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
