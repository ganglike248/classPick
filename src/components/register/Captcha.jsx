import { useEffect, useState } from "react";

export default function Captcha({ value, inputValue, onChange }) {
  // 실제 수강신청처럼 새 보안 코드가 늦게 뜨는 느낌을 재현: 표시 후 1~4초 랜덤 지연 후 숫자 표시
  // (호출부에서 key={value}로 값이 바뀔 때마다 이 컴포넌트를 새로 마운트시켜 매번 재생됨)
  const [numberVisible, setNumberVisible] = useState(false);

  useEffect(() => {
    const delay = 1000 + Math.random() * 3000;
    const timer = setTimeout(() => setNumberVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="card" style={{ padding: "5px", border: "0px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        <div className="captcha-box">
          <span className="captcha-value">{numberVisible ? value : ""}</span>
          <input
            type="text"
            maxLength={2}
            className="input-text input-small captcha-input"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <span className="section-desc">
          신청, 추가, 삭제 시 왼쪽 숫자를 정확히 입력해야 합니다.
        </span>
      </div>
    </section>
  );
}
