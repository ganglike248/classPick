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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  localStorage.setItem(key, JSON.stringify(presetObj));
}

export function deletePreset(key) {
  localStorage.removeItem(key);
}

export function getAvailablePresetKey() {
  return PRESET_KEYS.find((key) => !localStorage.getItem(key)) || null;
}
