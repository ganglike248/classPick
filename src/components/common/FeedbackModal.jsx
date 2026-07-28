import { useState } from "react";
import Modal from "./Modal";
import { submitFeedback } from "../../utils/feedbackUtils";

// Footer, 설명서 모달 등 여러 곳에서 재사용하는 피드백 전송 모달
export default function FeedbackModal({ onClose }) {
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
      onClose();
      alert("전달됐어요! 소중한 의견 감사합니다.");
    } catch (e) {
      console.error("피드백 전송 실패:", e);
      alert("전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>피드백 보내기</div>}
      onConfirm={handleSendFeedback}
      onCancel={onClose}
      confirmText={sending ? "보내는 중..." : "보내기"}
      cancelText="취소"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          textAlign: "left",
        }}
      >
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
          부적절한 내용은 예고 없이 즉시 삭제되며, 필요 시 익명 여부와
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
  );
}
