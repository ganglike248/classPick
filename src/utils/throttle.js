// 클라이언트 측 간단한 연속 요청 완화 장치.
//
// localStorage를 지우거나 다른 브라우저/시크릿 창을 쓰면 우회할 수 있는 수준의
// "약한" 방지책이다 — 실수로 여러 번 누르거나 단순 반복 클릭을 막는 용도이지,
// 작정하고 스크립트로 두드리는 공격까지 막지는 못한다. 그런 공격까지 막으려면
// Firebase App Check(reCAPTCHA) 같은 서버 측 검증이 필요하다.
export function checkAndSetThrottle(key, cooldownMs) {
  try {
    const last = Number(localStorage.getItem(key) || 0);
    const now = Date.now();
    if (now - last < cooldownMs) return false;
    localStorage.setItem(key, String(now));
    return true;
  } catch {
    // localStorage를 못 쓰는 환경이면 막지 않고 통과시킨다
    return true;
  }
}
