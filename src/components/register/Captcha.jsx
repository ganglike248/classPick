export default function Captcha({ value, inputValue, onChange }) {
  return (
    <section className="card" style={{ padding: "5px", border: "0px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        <div className="captcha-box">
          <span className="captcha-value">{value}</span>
          <input
            type="text"
            maxLength={2}
            className="input-text input-small captcha-input"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <span className="section-desc">
          신청, 추가, 삭제 시 왼쪽 숫자를 정확히 입력해야 합니다.
        </span>
      </div>
    </section>
  );
}
