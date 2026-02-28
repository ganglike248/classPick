import { useClock } from "../../hooks/useClock";

export default function TopBand() {
  const time = useClock();

  return (
    <header className="top-band">
      <div className="semester-badge">
        <div className="semester-badge__left">
          <div style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff" }}>
            {time}
          </div>
        </div>
        <div className="semester-badge__label">수강신청 연습 시스템</div>
      </div>
    </header>
  );
}
