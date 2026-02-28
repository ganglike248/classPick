import { useClock } from "../../hooks/useClock";

export default function TopBand() {
  const time = useClock();

  return (
    <header className="top-band">
      <div className="top-band__inner">
        <div className="top-band__brand">
          <span className="top-band__name">수강신청 연습</span>
          <span className="top-band__sub">모의 연습 시스템</span>
        </div>
        <div className="top-band__time">{time}</div>
      </div>
    </header>
  );
}
