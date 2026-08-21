import { useEffect } from "react";
import { trackButtonClick, trackUIInteraction } from "../../utils/analytics";
import guideImage from "../../assets/Frame.png";

// 세션(브라우저 탭)당 한 번 자동으로 띄웠는지 기억하는 데 쓰는 키.
// 자동 노출 여부는 이 컴포넌트를 여는 쪽(SetupPage)에서 초기 state로 판단하고,
// 닫힐 때 이 컴포넌트가 값을 기록함.
export const WELCOME_GUIDE_SESSION_KEY = "classPick_welcomeGuideShown";

// 홈 화면 진입 시 세션당 한 번(그리고 "설명서" 버튼으로 언제든) 띄우는 안내 팝업.
// 학생들 사이에서 오래 돌아다니던 "수강신청 꿀팁 캡처"를 ClassPick 화면 기준으로
// 다시 그린 안내 이미지(assets/Frame.png)를 그대로 보여줌.
export default function WelcomeGuideModal({ open, onClose, onOpenHelp }) {
  useEffect(() => {
    if (open) trackUIInteraction("welcome_guide_modal", "shown");
  }, [open]);

  const handleClose = () => {
    trackButtonClick("welcome_guide_modal_close", "확인했어요");
    try {
      sessionStorage.setItem(WELCOME_GUIDE_SESSION_KEY, "1");
    } catch {
      // 저장 실패해도 닫히기만 하면 됨
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "26px 30px 22px",
          width: "min(1160px, 96vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1e2532" }}>
              수강신청 한눈에 보기
            </div>
            <div style={{ fontSize: "12.5px", color: "#8c96ae", marginTop: "6px", lineHeight: 1.6 }}>
              자주 헷갈리는 신청·추가·삭제 과정을 한 장으로 정리했어요.
              <br />
              실제 수강신청도 딱 이 순서예요 — 미리 손에 익혀두세요!
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#9ca3af",
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        <img
          src={guideImage}
          alt="ClassPick 수강신청 화면에서 신청·추가·삭제하는 방법을 번호로 안내하는 이미지"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            marginTop: "18px",
            borderRadius: "8px",
          }}
        />

        <div
          style={{
            marginTop: "22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {onOpenHelp ? (
            <button
              type="button"
              onClick={() => {
                trackButtonClick("welcome_guide_modal_open_help", "설명서 더 보기");
                handleClose();
                onOpenHelp();
              }}
              style={{
                background: "none",
                border: "none",
                color: "#478ef0",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              사용법 더 자세히 보기 →
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ backgroundColor: "rgb(71,142,240)", color: "#fff", padding: "9px 22px" }}
            onClick={handleClose}
          >
            확인했어요, 연습하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
