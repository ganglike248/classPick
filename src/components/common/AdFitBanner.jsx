import { useEffect, useRef } from "react";

const ADFIT_SCRIPT_SRC = "//t1.daumcdn.net/kas/static/ba.min.js";

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
 * SPA 주의사항: 애드핏 스크립트(ba.min.js)는 로드되는 시점에 화면에 있는
 * .kakao_ad_area를 딱 한 번만 스캔한다. 앱이 처음 켜질 때부터 떠 있는 광고
 * (예: 하단 고정 배너)는 그 첫 스캔에 걸려 채워지지만, 그 뒤 페이지 이동으로
 * 새로 나타나는 광고(예: 결과/랭킹 페이지 본문 배너)는 스크립트를 다시 실행해
 * 주지 않으면 영영 스캔되지 않는다. 그래서 "이미 로드됐으면 건너뛰기"가 아니라,
 * 이 컴포넌트가 마운트될 때마다 스크립트 태그를 새로 만들어 넣어 매번 다시
 * 스캔되게 하고, 언마운트 시 애드핏이 제공하는 destroy로 정리한다.
 *
 * @param unitId  AdFit 대시보드에서 발급받은 광고 단위 ID (예: DAN-xxxxxxxxxxxx)
 * @param width   배너 광고일 때 너비 (px). 앵커 배너는 자체 반응형이라 생략 가능
 * @param height  배너 광고일 때 높이 (px). 앵커 배너는 자체 반응형이라 생략 가능
 */
export default function AdFitBanner({ unitId, width, height, style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!unitId || !containerRef.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = ADFIT_SCRIPT_SRC;
    containerRef.current.appendChild(script);

    return () => {
      // 애드핏 SDK가 로드해둔 전역 객체로 이 광고 단위를 정리 (다음 마운트 때
      // 새로 스캔되도록). 아직 SDK가 안 떴거나 이미 정리된 경우는 조용히 무시.
      try {
        window.adfit?.destroy?.(unitId);
      } catch {
        /* ignore */
      }
      script.remove();
    };
  }, [unitId]);

  if (!unitId) return null;

  return (
    <div
      ref={containerRef}
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
