import { DIFFICULTY_CONFIGS } from "../../utils/practiceUtils";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function PracticeModeSetup({
  enabled,
  onToggle,
  difficulty,
  onDifficultyChange,
  nickname,
  onNicknameChange,
}) {
  return (
    <div
      style={{
        marginTop: "10px",
        paddingTop: "10px",
        borderTop: "1px dashed #e0e2e8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: enabled ? "10px" : "0",
        }}
      >
        <div className="login-panel__field-label" style={{ margin: 0 }}>
          실전 모드
        </div>
        <button
          type="button"
          className="btn btn-sm"
          style={{
            backgroundColor: enabled ? "rgb(71,142,240)" : "#fff",
            color: enabled ? "#fff" : "#333",
            borderColor: enabled ? "rgb(71,142,240)" : "#c0c4cc",
            minWidth: "48px",
          }}
          onClick={onToggle}
        >
          {enabled ? "켜짐" : "꺼짐"}
        </button>
      </div>

      {enabled && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <div className="helper-text" style={{ marginBottom: "4px" }}>
              난이도
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  className="btn btn-sm"
                  style={{
                    backgroundColor:
                      difficulty === d ? "rgb(71,142,240)" : "#fff",
                    color: difficulty === d ? "#fff" : "#333",
                    borderColor:
                      difficulty === d ? "rgb(71,142,240)" : "#c0c4cc",
                  }}
                  onClick={() => onDifficultyChange(d)}
                >
                  {DIFFICULTY_CONFIGS[d].label} (
                  {DIFFICULTY_CONFIGS[d].min}~{DIFFICULTY_CONFIGS[d].max}초)
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="helper-text" style={{ marginBottom: "4px" }}>
              닉네임 (선택, 최대 12자)
            </div>
            <input
              type="text"
              className="input-text"
              maxLength={12}
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              placeholder="입력 안 하면 '익명'"
              style={{ width: "100%" }}
            />
          </div>

          <div className="helper-text" style={{ color: "#e54b4b" }}>
            각 과목은 무작위 시간에 마감됩니다. 마감 여부는 따로 표시되지
            않습니다.
          </div>
        </div>
      )}
    </div>
  );
}
