import { useEffect } from "react";

const ADFIT_SCRIPT_SRC = "//t1.daumcdn.net/kas/static/ba.min.js";

function loadAdFitScript() {
  if (document.querySelector(`script[src="${ADFIT_SCRIPT_SRC}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = ADFIT_SCRIPT_SRC;
  document.body.appendChild(script);
}

/**
 * 카카오 애드핏(Kakao AdFit) 배너.
 *
 * unitId가 없으면(아직 광고 단위를 발급받기 전) 아무것도 렌더링하지 않아
 * 레이아웃이 깨지지 않는다 — 발급 후 .env에 unitId만 채워 넣으면 바로 노출됨.
 *
 * @param unitId  AdFit 대시보드에서 발급받은 광고 단위 ID (예: DAN-xxxxxxxxxxxx)
 * @param width   배너 광고일 때 너비 (px). 앵커 배너는 자체 반응형이라 생략 가능
 * @param height  배너 광고일 때 높이 (px). 앵커 배너는 자체 반응형이라 생략 가능
 */
export default function AdFitBanner({ unitId, width, height, style }) {
  useEffect(() => {
    if (!unitId) return;
    loadAdFitScript();
  }, [unitId]);

  if (!unitId) return null;

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none", ...style }}
      data-ad-unit={unitId}
      {...(width ? { "data-ad-width": width } : {})}
      {...(height ? { "data-ad-height": height } : {})}
    />
  );
}
