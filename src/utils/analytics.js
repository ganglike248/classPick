import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "../firebase";

let analytics = null;

export function initializeAnalytics() {
  if (!analytics) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

export function trackPageView(pageName) {
  if (!analytics) return;
  logEvent(analytics, "page_view", {
    page_title: pageName,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName, eventParams = {}) {
  if (!analytics) return;
  logEvent(analytics, eventName, eventParams);
}

// 주요 사용자 액션 추적 함수들
export function trackButtonClick(buttonName, buttonLabel) {
  trackEvent("button_click", {
    button_name: buttonName,
    button_label: buttonLabel,
    timestamp: new Date().toISOString(),
  });
}

export function trackCourseRegistration(courseId, courseName, difficulty) {
  trackEvent("course_registered", {
    course_id: courseId,
    course_name: courseName,
    difficulty: difficulty,
    timestamp: new Date().toISOString(),
  });
}

export function trackCourseDeletion(courseId, courseName) {
  trackEvent("course_deleted", {
    course_id: courseId,
    course_name: courseName,
    timestamp: new Date().toISOString(),
  });
}

export function trackCaptchaValidation(success) {
  trackEvent("captcha_validation", {
    success: success,
    timestamp: new Date().toISOString(),
  });
}

export function trackModeStart(modeType, difficulty) {
  trackEvent("mode_started", {
    mode_type: modeType, // "trial", "practice", "challenge"
    difficulty: difficulty,
    timestamp: new Date().toISOString(),
  });
}

export function trackModeComplete(modeType, registeredCount, missedCount, totalTime) {
  trackEvent("mode_completed", {
    mode_type: modeType,
    registered_count: registeredCount,
    missed_count: missedCount,
    total_time_ms: totalTime,
    timestamp: new Date().toISOString(),
  });
}

export function trackPresetAction(action, presetName) {
  trackEvent("preset_action", {
    action: action, // "save", "load", "delete"
    preset_name: presetName,
    timestamp: new Date().toISOString(),
  });
}

export function trackCodeInput(success, courseId) {
  trackEvent("code_input", {
    success: success,
    course_id: courseId,
    timestamp: new Date().toISOString(),
  });
}

export function trackUIInteraction(componentName, interactionType, additionalData = {}) {
  trackEvent("ui_interaction", {
    component_name: componentName,
    interaction_type: interactionType,
    ...additionalData,
    timestamp: new Date().toISOString(),
  });
}

export function trackError(errorType, errorMessage) {
  trackEvent("app_error", {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString(),
  });
}

export function trackPracticeTimer(elapsedTime, difficulty, action) {
  trackEvent("practice_timer", {
    elapsed_time_ms: elapsedTime,
    difficulty: difficulty,
    action: action, // "started", "paused", "resumed"
    timestamp: new Date().toISOString(),
  });
}

export function trackChallengeRanking(nickname, registeredCount, totalCount, timeMs) {
  trackEvent("challenge_ranking", {
    nickname: nickname,
    registered_count: registeredCount,
    total_count: totalCount,
    time_ms: timeMs,
    timestamp: new Date().toISOString(),
  });
}
