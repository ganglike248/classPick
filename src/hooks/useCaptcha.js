import { useState, useCallback } from "react";

export function useCaptcha() {
  const [captchaValue, setCaptchaValue] = useState(() =>
    String(Math.floor(Math.random() * 90) + 10)
  );
  const [captchaInput, setCaptchaInput] = useState("");

  const generate = useCallback(() => {
    setCaptchaValue(String(Math.floor(Math.random() * 90) + 10));
    setCaptchaInput("");
  }, []);

  const check = useCallback(() => {
    if (captchaValue !== captchaInput.trim()) {
      alert("보안 코드를 정확히 입력해 주세요.");
      return false;
    }
    return true;
  }, [captchaValue, captchaInput]);

  return { captchaValue, captchaInput, setCaptchaInput, generate, check };
}
