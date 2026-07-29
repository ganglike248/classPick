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
 * width/height를 주면 실제 광고가 채워지기 전에도 그 크기만큼 자리를 미리
 * 확보해 옅은 테두리로 보여준다 (광고 미노출 시 레이아웃이 갑자기 줄어들거나,
 * 자리가 아예 안 보여서 "제대로 붙었는지" 확인이 안 되는 문제를 방지).
 * 실제 광고가 채워지면 애드핏 스크립트가 그 안에 iframe을 넣어 대체한다.
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
    <div
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        border: "1px dashed #d0d6e8",
        background: "#f8fafd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: "none", ...style }}
        data-ad-unit={unitId}
        {...(width ? { "data-ad-width": width } : {})}
        {...(height ? { "data-ad-height": height } : {})}
      />
    </div>
  );
}
