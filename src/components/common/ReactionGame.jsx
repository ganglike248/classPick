import { useEffect, useRef, useState } from "react";

// 대기 중 손 풀기용 반응속도 테스트. 기록을 어디에도 저장하지 않는 순수 놀이용 컴포넌트.
const IDLE = "idle";
const WAITING = "waiting";
const READY = "ready";
const TOO_SOON = "too_soon";
const RESULT = "result";

const BOX_STYLE = {
  [IDLE]: { background: "#478ef0", text: "클릭해서 시작" },
  [WAITING]: { background: "#e54b4b", text: "준비..." },
  [READY]: { background: "#22c55e", text: "지금 클릭!" },
  [TOO_SOON]: { background: "#e54b4b", text: "너무 빨랐어요! 클릭해서 재도전" },
};

/**
 * bordered  자체 카드(흰 배경+테두리)와 제목을 그릴지 여부.
 *           바깥에 이미 카드/제목이 있는 곳에 넣을 땐 false로 이중 표시 방지.
 */
export default function ReactionGame({ bordered = true }) {
  const [state, setState] = useState(IDLE);
  const [reactionMs, setReactionMs] = useState(null);
  const [bestMs, setBestMs] = useState(null);
  const timerRef = useRef(null);
  const readyAtRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const startWaiting = () => {
    setReactionMs(null);
    setState(WAITING);
    const delay = 1000 + Math.random() * 3000; // 1~4초
    timerRef.current = setTimeout(() => {
      readyAtRef.current = performance.now();
      setState(READY);
    }, delay);
  };

  const handleClick = () => {
    if (state === IDLE || state === TOO_SOON || state === RESULT) {
      startWaiting();
      return;
    }
    if (state === WAITING) {
      clearTimeout(timerRef.current);
      setState(TOO_SOON);
      return;
    }
    if (state === READY) {
      const elapsed = Math.round(performance.now() - readyAtRef.current);
      setReactionMs(elapsed);
      setBestMs((prev) => (prev === null ? elapsed : Math.min(prev, elapsed)));
      setState(RESULT);
    }
  };

  const box = state === RESULT
    ? { background: "#478ef0", text: `${reactionMs}ms — 클릭해서 재도전` }
    : BOX_STYLE[state];

  const content = (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e2532" }}>
          {bordered ? "🎮 손풀기: 반응속도 테스트" : "반응속도 테스트"}
        </div>
        {bestMs !== null && (
          <span className="badge">최고 기록 {bestMs}ms</span>
        )}
      </div>
      <div
        onClick={handleClick}
        style={{
          background: box.background,
          color: "#fff",
          borderRadius: "8px",
          padding: "28px 0",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.1s",
        }}
      >
        {box.text}
      </div>
      <div className="helper-text" style={{ marginTop: "8px", textAlign: "center" }}>
        기록은 저장되지 않아요. 그냥 손 풀기용이에요!
      </div>
    </>
  );

  if (!bordered) return content;

  return (
    <div style={{ background: "#fff", border: "1px solid #e6eaf3", borderRadius: "10px", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {content}
    </div>
  );
}
