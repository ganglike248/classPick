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

  // 카드/제목은 RegisteredCourses(신청 결과 표)와 한 섹션으로 묶여 보이도록
  // RegisterPage에서 함께 감싸며, 이 컴포넌트는 입력 박스만 그린다.
  return (
    <div className="code-input-box">
      <div className="code-input-box__fields">
        <input
          ref={frontRef}
          type="text"
          maxLength={5}
          className="input-text"
          style={{ width: "80px", textAlign: "center" }}
          value={front}
          onChange={(e) => setFront(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && backRef.current?.focus()}
        />
        <span>-</span>
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
        <span className="code-input-box__desc">
          신청할 과목코드(5자리-2자리)를 입력한 후 '추가'버튼을 누르십시오.
        </span>
      </div>
      <button type="button" className="code-input-box__add-btn" onClick={handleAdd}>
        <span aria-hidden="true">+</span> 추가
      </button>
    </div>
  );
}
