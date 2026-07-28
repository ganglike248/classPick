// 구글 애드센스(https://adsense.google.com) 연동.
//
// 승인 전에는 VITE_ADSENSE_CLIENT_ID가 비어 있어 아무 것도 하지 않는다.
// 신청 심사 자체는 사이트에 로더 스크립트가 있어야 진행되므로,
// 발행자 ID(ca-pub-XXXXXXXXXXXXXXXX)를 발급받으면 .env에 채워 넣기만 하면
// 심사용 스크립트가 자동으로 삽입된다. (승인 후 실제 광고 단위 삽입은 별도 작업)
export function initAdsense() {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  if (!clientId) return;
  if (document.querySelector('script[data-adsense-loader="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  script.dataset.adsenseLoader = "true";
  document.head.appendChild(script);
}
