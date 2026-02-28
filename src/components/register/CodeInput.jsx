import { useRef, useState } from "react";

export default function CodeInput({ onAdd }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleAdd = () => {
    const f = front.trim();
    const b = back.trim();

    if (!f || !b) {
      alert("강좌번호 앞 5자리와 뒤 2자리를 모두 입력해 주세요.");
      return;
    }
    if (!/^\d{5}$/.test(f) || !/^\d{2}$/.test(b)) {
      alert("강좌번호 형식이 올바르지 않습니다. (예: 12345-01)");
      return;
    }

    const code = `${f}-${b}`;
    const success = onAdd(code);
    if (success) {
      setFront("");
      setBack("");
      frontRef.current?.focus();
    }
  };

  return (
    <section className="card">
      <div className="section-title">수강신청 과목 코드 입력</div>
      <div className="table-wrap">
        <table className="data-table">
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>
                <input
                  ref={frontRef}
                  type="text"
                  maxLength={5}
                  className="input-text"
                  style={{ width: "80px", textAlign: "center" }}
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  onKeyUp={(e) =>
                    e.key === "Enter" && backRef.current?.focus()
                  }
                />
                {" - "}
                <input
                  ref={backRef}
                  type="text"
                  maxLength={2}
                  className="input-text"
                  style={{ width: "50px", textAlign: "center" }}
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleAdd()}
                />
                <span className="helper-text" style={{ marginLeft: "12px" }}>
                  아무 강좌번호나 입력해서 신청할 수 있습니다. (예: 12345-01,
                  미리 정의되지 않은 경우 교과목명 '-' / 3학점으로 처리)
                </span>
              </td>
              <td style={{ width: "90px" }}>
                <button
                  className="btn btn-primary btn-block"
                  style={{
                    backgroundColor: "rgb(67, 67, 184)",
                    color: "white",
                  }}
                  onClick={handleAdd}
                >
                  추가
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
