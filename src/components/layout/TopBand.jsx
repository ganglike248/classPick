import { useNavigate } from "react-router-dom";
import { useClock } from "../../hooks/useClock";

// onBrandClick을 넘기면 그 페이지만의 정리 로직(예: 결과 화면의 데이터 정리)을 먼저 태울 수 있음.
// 넘기지 않으면 기본값으로 그냥 홈으로 이동함.
export default function TopBand({ onBrandClick }) {
  const navigate = useNavigate();
  const time = useClock();

  const handleBrandClick = onBrandClick ?? (() => navigate("/"));

  return (
    <header className="top-band">
      <div className="top-band__inner">
        <div
          className="top-band__brand"
          onClick={handleBrandClick}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleBrandClick();
          }}
        >
          <span className="top-band__name">수강신청 연습</span>
          <span className="top-band__sub">모의 연습 시스템</span>
        </div>
        <div className="top-band__time">{time}</div>
      </div>
    </header>
  );
}
