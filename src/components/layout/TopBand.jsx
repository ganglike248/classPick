import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClock } from "../../hooks/useClock";
import Modal from "../common/Modal";
import { UPDATE_LOG } from "../../data/updateLog";
import { trackButtonClick } from "../../utils/analytics";

// onBrandClick을 넘기면 그 페이지만의 정리 로직(예: 결과 화면의 데이터 정리)을 먼저 태울 수 있음.
// 넘기지 않으면 기본값으로 그냥 홈으로 이동함.
export default function TopBand({ onBrandClick }) {
  const navigate = useNavigate();
  const time = useClock();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleBrandClick = onBrandClick ?? (() => navigate("/"));

  return (
    <>
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
            <span className="top-band__name">수강신청 연습 시스템</span>
            <button
              type="button"
              className="top-band__sub"
              title="업데이트 내역 보기"
              onClick={(e) => {
                e.stopPropagation();
                trackButtonClick("update_log_button", "버전 뱃지");
                setShowUpdateModal(true);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
              }}
            >
              v{__APP_VERSION__} · 업데이트 내역
            </button>
          </div>
          <div className="top-band__time">{time}</div>
        </div>
      </header>

      {showUpdateModal && (
        <Modal
          title="업데이트 내역"
          onConfirm={() => setShowUpdateModal(false)}
          confirmText="닫기"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              fontSize: "13px",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {UPDATE_LOG.map((entry, i) => (
              <div
                key={i}
                style={{
                  paddingBottom: i < UPDATE_LOG.length - 1 ? "14px" : 0,
                  borderBottom:
                    i < UPDATE_LOG.length - 1 ? "1px solid #eef1f7" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#1e2532",
                    }}
                  >
                    {entry.title}
                  </span>
                  <span style={{ fontSize: "11px", color: "#8c96ae" }}>
                    {entry.date}
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px" }}>
                  {entry.items.map((item, j) => (
                    <li key={j} style={{ marginBottom: "4px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#478ef0",
                          background: "#eaf1fd",
                          padding: "1px 6px",
                          borderRadius: "999px",
                          marginRight: "6px",
                        }}
                      >
                        v{item.version}
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
