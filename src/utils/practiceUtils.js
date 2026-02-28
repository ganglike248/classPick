export const DIFFICULTY_CONFIGS = {
  easy:   { min: 60,  max: 120, label: "하", globalTimeout: 120 },
  medium: { min: 30,  max: 60,  label: "중", globalTimeout: 60 },
  hard:   { min: 10,  max: 30,  label: "상", globalTimeout: 30 },
};

/** courseIds 배열에 대해 각각 무작위 마감 timestamp를 생성 */
export function generateCourseDeadlines(courseIds, difficulty, startTime) {
  const { min, max } = DIFFICULTY_CONFIGS[difficulty] ?? DIFFICULTY_CONFIGS.medium;
  const deadlines = {};
  courseIds.forEach((id) => {
    const seconds = min + Math.random() * (max - min);
    deadlines[id] = startTime + Math.round(seconds * 1000);
  });
  return deadlines;
}

/** 해당 과목이 현재 시각 기준 마감됐는지 확인 */
export function isClosed(courseId, courseDeadlines) {
  if (!courseDeadlines || !courseDeadlines[courseId]) return false;
  return Date.now() > courseDeadlines[courseId];
}

/** ms → "X.X초" 형식 */
export function formatElapsedMs(ms) {
  return `${(ms / 1000).toFixed(1)}초`;
}

/** ms → "X분 Y초" 형식 */
export function formatElapsedLong(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}초`;
  return `${min}분 ${sec}초`;
}
