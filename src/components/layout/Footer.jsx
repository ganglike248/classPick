import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { submitFeedback } from "../../utils/feedbackUtils";

const EMAIL = "business9498@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendFeedback = async () => {
    const trimmed = feedbackMessage.trim();
    if (!trimmed) {
      alert("메시지를 입력해 주세요.");
      return;
    }
    setSending(true);
    try {
      await submitFeedback(trimmed);
      setFeedbackMessage("");
      setShowFeedbackModal(false);
      alert("전달됐어요! 소중한 의견 감사합니다 🙏");
    } catch (e) {
      console.error("피드백 전송 실패:", e);
      alert("전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="footer">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            marginBottom: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#6b7280",
          }}
        >
          연습용 모의 수강신청 시스템
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            marginBottom: "12px",
            lineHeight: 1.6,
          }}
        >
          본 사이트는 실제 대학교 시스템과 무관하며, 학습 목적으로
          제작되었습니다. 일부 데이터는 서비스 개선을 위해 Firebase에 익명으로
          수집될 수 있습니다.
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Link to="/privacy" style={{ color: "#6b9fe8", fontSize: "11px" }}>
            개인정보처리방침
          </Link>
          <span style={{ color: "#d1d5db" }}>·</span>
          <Link to="/terms" style={{ color: "#6b9fe8", fontSize: "11px" }}>
            이용약관
          </Link>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span style={{ fontSize: "11px" }}>
            © 2026 Course Practice. Educational Use Only.
          </span>
        </div>
        <div
          style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}
        >
          문의 및 피드백:{" "}
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleCopyEmail}
            title="클릭하면 이메일 주소가 복사됩니다"
            style={{
              color: copied ? "#22c55e" : "#6b9fe8",
              transition: "color 0.2s",
            }}
          >
            {copied ? "복사됨!" : EMAIL}
          </a>{" "}
          ·{" "}
          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#6b9fe8",
              fontSize: "11px",
              textDecoration: "underline",
            }}
          >
            💬 메시지로 간편하게 보내기
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <Modal
          title="💬 피드백 보내기"
          onConfirm={handleSendFeedback}
          onCancel={() => setShowFeedbackModal(false)}
          confirmText={sending ? "보내는 중..." : "보내기"}
          cancelText="취소"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="helper-text">
              불편한 점이나 개선됐으면 하는 점을 편하게 남겨주세요. 이메일 없이
              바로 전달돼요.
            </div>
            <div
              style={{
                background: "#fff8f8",
                border: "1px solid #fac5c5",
                borderLeft: "4px solid #e54b4b",
                borderRadius: "4px",
                padding: "8px 10px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#c0392b",
                lineHeight: 1.6,
              }}
            >
              ⚠️ 부적절한 내용은 예고 없이 즉시 삭제되며, 필요 시 익명 여부와
              관계없이<br></br>
              서비스 이용 제한 및 법적 조치가 취해질 수 있습니다.
            </div>
            <textarea
              className="input-text"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="예: 실전 모드에서 이런 게 있으면 좋겠어요..."
              maxLength={1000}
              rows={5}
              style={{
                width: "100%",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
        </Modal>
      )}
    </footer>
  );
}
