import { useState, useEffect } from "react";
import { DIFFICULTY_CONFIGS } from "../../utils/practiceUtils";

export default function PracticeTimer({ startedAt, difficulty, type }) {
  const [elapsed, setElapsed] = useState(Date.now() - startedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);
    return () => clearInterval(interval);
  }, [startedAt]);

  const diffLabel = DIFFICULTY_CONFIGS[difficulty]?.label ?? "";
  const seconds = (elapsed / 1000).toFixed(1);
  const modeLabel = type === "challenge" ? "랭킹 도전" : "실전 연습";

  return (
    <div
      style={{
        background: "#555f6a",
        color: "#fff",
        padding: "6px 16px",
        fontSize: "12px",
        display: "flex",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <span>
        [{modeLabel} · 난이도 {diffLabel}]
      </span>
      <span>
        경과 시간: <strong>{seconds}초</strong>
      </span>
    </div>
  );
}
