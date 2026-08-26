import { useEffect, useState } from "react";

// 실제 캡차처럼 숫자마다 색/기울기가 다르게 보이도록, value의 각 글자마다
// 고정된(무작위 아닌) 스타일을 계산한다. 같은 value면 항상 같은 모양이 나오면 되므로
// 글자 코드 기반의 간단한 규칙만 쓴다.
const DIGIT_COLORS = ["#c0392b", "#1a7a3c", "#1a4fa0", "#8a5a00"];
const DIGIT_FONTS = ["Georgia, serif", "'Courier New', monospace", "inherit"];

function digitStyle(char, index) {
  const code = char.charCodeAt(0) + index;
  const rotate = ((code % 5) - 2) * 8; // -16deg ~ 16deg
  const color = DIGIT_COLORS[code % DIGIT_COLORS.length];
  const fontFamily = DIGIT_FONTS[code % DIGIT_FONTS.length];
  const translateY = (code % 3) - 1; // -1px ~ 1px
  return {
    color,
    fontFamily,
    transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
  };
}

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
          <span className="captcha-value">
            {numberVisible
              ? String(value)
                  .split("")
                  .map((ch, i) => (
                    <span key={i} className="captcha-digit" style={digitStyle(ch, i)}>
                      {ch}
                    </span>
                  ))
              : ""}
          </span>
          <input
            type="text"
            maxLength={2}
            className="input-text input-small captcha-input"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <span className="section-desc" style={{ fontWeight: 700 }}>
          신청이나 추가, 삭제 시 왼쪽의 숫자를 반드시 입력해 주십시오.
        </span>
      </div>
    </section>
  );
}
