export default function Modal({
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
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
