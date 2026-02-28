export const STORAGE_KEY = "courseRegistrationPracticeState";
export const PRESET_KEYS = ["preset1", "preset2", "preset3"];

export function validateState(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.courses || typeof raw.courses !== "object") return null;
  if (!Array.isArray(raw.cartCourseIds) || !Array.isArray(raw.registeredCourseIds)) return null;
  if (!raw.student || typeof raw.student !== "object") return null;
  if (!Array.isArray(raw.codeInputCourseIds)) raw.codeInputCourseIds = [];

  const s = raw.student;
  if (typeof s.maxCredits !== "number" || s.maxCredits <= 0) s.maxCredits = 20;
  if (typeof s.yearSemester !== "string") s.yearSemester = "2026년 1학기";
  if (typeof s.studentId !== "string") s.studentId = "0000000";
  if (typeof s.name !== "string") s.name = "연습용 학생";
  if (typeof s.major !== "string") s.major = "연습전공";
  if (typeof s.grade !== "string") s.grade = "3학년";
  if (typeof s.term !== "string") s.term = "6학기";

  // courses 내부 항목 유효성 보정: 비정상 항목은 제거
  for (const id of Object.keys(raw.courses)) {
    const c = raw.courses[id];
    if (
      typeof c !== "object" ||
      c === null ||
      typeof c.id !== "string" ||
      typeof c.name !== "string" ||
      typeof c.credit !== "number" ||
      c.credit <= 0
    ) {
      delete raw.courses[id];
    }
  }
  // ID 배열에는 있지만 courses에 없는 항목 정리
  raw.cartCourseIds = raw.cartCourseIds.filter((id) => raw.courses[id]);
  raw.registeredCourseIds = raw.registeredCourseIds.filter((id) => raw.courses[id]);
  raw.codeInputCourseIds = raw.codeInputCourseIds.filter((id) => raw.courses[id]);

  return raw;
}

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return validateState(JSON.parse(raw));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("상태 저장 실패:", e);
  }
}

export function buildInitialState(cartRows, regRows, codeRows, maxCredits) {
  const courses = {};
  const cartIds = [], regIds = [], codeIds = [];

  function pushRow(row, targetArr) {
    courses[row.id] = { id: row.id, name: row.name, credit: row.credit };
    targetArr.push(row.id);
  }

  cartRows.forEach((r) => pushRow(r, cartIds));
  regRows.forEach((r) => pushRow(r, regIds));
  codeRows.forEach((r) => pushRow(r, codeIds));

  let safeMax = parseInt(maxCredits, 10);
  if (Number.isNaN(safeMax) || safeMax <= 0) safeMax = 20;
  if (safeMax > 30) safeMax = 30;

  return {
    student: {
      yearSemester: "2026년 1학기",
      studentId: "0000000",
      name: "연습용 학생",
      major: "연습전공",
      grade: "3학년",
      term: "6학기",
      maxCredits: safeMax,
    },
    courses,
    cartCourseIds: cartIds,
    registeredCourseIds: regIds,
    codeInputCourseIds: codeIds,
  };
}

export function loadPresets() {
  const result = [];
  PRESET_KEYS.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        result.push({ key, ...data });
      } catch {
        localStorage.removeItem(key);
      }
    }
  });
  return result;
}

export function savePreset(key, name, presetData) {
  const presetObj = {
    name: name.trim(),
    data: presetData,
    timestamp: new Date().toISOString(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(presetObj));
  } catch (e) {
    console.error("프리셋 저장 실패:", e);
    throw e; // 호출부(PresetManager)에서 사용자에게 알릴 수 있도록 re-throw
  }
}

export function deletePreset(key) {
  localStorage.removeItem(key);
}

export function getAvailablePresetKey() {
  return PRESET_KEYS.find((key) => !localStorage.getItem(key)) || null;
}
