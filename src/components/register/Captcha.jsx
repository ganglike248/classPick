import { useEffect, useState } from "react";

// 실제 수강신청처럼 새 보안 코드가 늦게 뜨는 느낌을 재현: 표시 후 지연 뒤 숫자 표시.
// delayMs를 넘기면 그 값을 고정으로 쓰고(예: 랭킹 도전 모드는 기록 비교의 공정성을 위해
// 사람마다 지연이 달라지지 않도록 2초로 고정), 넘기지 않으면 1~4초 랜덤 지연을 쓴다.
export default function Captcha({ value, inputValue, onChange, delayMs }) {
  // (호출부에서 key={value}로 값이 바뀔 때마다 이 컴포넌트를 새로 마운트시켜 매번 재생됨)
  const [numberVisible, setNumberVisible] = useState(false);

  useEffect(() => {
    const delay = delayMs ?? 1000 + Math.random() * 3000;
    const timer = setTimeout(() => setNumberVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delayMs]);

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
