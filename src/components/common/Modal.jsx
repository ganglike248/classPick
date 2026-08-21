export default function Modal({
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}) {
  // 명시적인 취소 동작이 없는 모달(예: 도움말)도 X 버튼으로는 닫을 수 있어야 하므로,
  // onCancel이 없으면 onConfirm(보통 "닫기" 역할)을 대신 사용함.
  const handleClose = onCancel ?? onConfirm;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {(title || handleClose) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "18px",
            }}
          >
            {title ? (
              <div className="modal-title" style={{ margin: 0 }}>
                {title}
              </div>
            ) : (
              <span />
            )}
            {handleClose && (
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
                  marginLeft: "12px",
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ backgroundColor: "rgb(71,142,240)", color: "#fff" }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
