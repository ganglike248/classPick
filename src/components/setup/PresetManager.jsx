import { useState, useEffect } from "react";
import {
  loadPresets,
  savePreset,
  deletePreset,
  getAvailablePresetKey,
} from "../../utils/storage";
import { formatPresetDate } from "../../utils/courseUtils";

export default function PresetManager({ getCurrentPreset, onLoad }) {
  const [presets, setPresets] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");

  const refresh = () => setPresets(loadPresets());

  useEffect(() => {
    refresh();
  }, []);

  const handleSave = () => {
    const name = prompt("프리셋 이름을 입력하세요 (최대 20자):");
    if (!name || name.trim().length === 0) {
      alert("이름을 입력해 주세요.");
      return;
    }
    if (name.trim().length > 20) {
      alert("이름은 최대 20자까지 입력 가능합니다.");
      return;
    }

    const key = getAvailablePresetKey();
    if (!key) {
      alert("프리셋 슬롯이 가득 찼습니다.\n기존 프리셋을 삭제한 후 다시 시도해 주세요.");
      return;
    }

    try {
      savePreset(key, name, getCurrentPreset());
      refresh();
      alert(`'${name.trim()}' 프리셋이 저장되었습니다.`);
    } catch {
      alert("저장 공간이 부족하여 프리셋을 저장할 수 없습니다.");
    }
  };

  const handleLoad = () => {
    if (!selectedKey) {
      alert("불러올 프리셋을 선택해 주세요.");
      return;
    }

    const preset = presets.find((p) => p.key === selectedKey);
    if (!preset?.data) {
      alert("프리셋 불러오기 실패. 해당 프리셋이 삭제됩니다.");
      deletePreset(selectedKey);
      refresh();
      setSelectedKey("");
      return;
    }

    if (confirm(`'${preset.name}' 프리셋을 불러오시겠습니까?\n현재 설정이 덮어쓰입니다.`)) {
      onLoad(preset.data);
      alert("프리셋이 불러와졌습니다.");
    }
  };

  const handleDelete = () => {
    if (!selectedKey) {
      alert("삭제할 프리셋을 선택해 주세요.");
      return;
    }
    if (confirm("선택한 프리셋을 삭제하시겠습니까?")) {
      deletePreset(selectedKey);
      refresh();
      setSelectedKey("");
      alert("프리셋이 삭제되었습니다.");
    }
  };

  return (
    <div
      style={{
        marginBottom: "16px",
        borderTop: "1px solid #e0e2e8",
        paddingTop: "10px",
        marginTop: "10px",
      }}
    >
      <div className="login-panel__field-label">프리셋 저장/불러오기</div>
      <select
        className="input-text"
        style={{ width: "100%", marginBottom: "8px" }}
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
      >
        <option value="">선택하세요</option>
        {presets.map((p) => {
          const date = formatPresetDate(p.timestamp);
          const label = date ? `${p.name} (${date})` : p.name;
          return (
            <option key={p.key} value={p.key}>
              {label}
            </option>
          );
        })}
      </select>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          className="btn btn-sm"
          style={{
            flex: 1,
            backgroundColor: "rgb(71,142,240)",
            color: "white",
            borderRadius: "4px",
          }}
          onClick={handleLoad}
        >
          불러오기
        </button>
        <button
          className="btn btn-sm"
          style={{
            flex: 1,
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "4px",
          }}
          onClick={handleSave}
        >
          저장
        </button>
        <button
          className="btn btn-sm btn-danger"
          style={{ flex: 1, borderRadius: "4px" }}
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
      <div className="helper-text" style={{ marginTop: "4px" }}>
        연습용 과목 설정을 최대 3개까지 저장하고 불러올 수 있습니다.
      </div>
    </div>
  );
}
