import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/layout/MainNav";
import Footer from "../components/layout/Footer";
import StudentInfo from "../components/register/StudentInfo";
import CartCourses from "../components/register/CartCourses";
import Captcha from "../components/register/Captcha";
import CodeInput from "../components/register/CodeInput";
import RegisteredCourses from "../components/register/RegisteredCourses";
import PracticeTimer from "../components/register/PracticeTimer";
import { loadStoredState, saveState, PRACTICE_RESULT_KEY } from "../utils/storage";
import { useCaptcha } from "../hooks/useCaptcha";
import {
  generateCourseDeadlines,
  isClosed,
  DIFFICULTY_CONFIGS,
} from "../utils/practiceUtils";
import { startChallengeSession, finishChallengeSession } from "../utils/rankingUtils";
import { CHALLENGE_ID } from "../data/challengeData";

function getCourseCredit(courses, id) {
  const c = courses[id];
  if (!c || typeof c.credit !== "number" || c.credit <= 0) return 3;
  return c.credit;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const { captchaValue, captchaInput, setCaptchaInput, generate, check } = useCaptcha();

  // 실전 모드: 흰 화면 여부 (practiceMode가 활성화이고 아직 시작 안 됐으면 true)
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const stateRef = useRef(null);
  const hasEndedRef = useRef(false);

  // state가 바뀔 때마다 ref 동기화 (타이머 콜백의 stale closure 방지)
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 초기 로드
  useEffect(() => {
    const s = loadStoredState();
    if (!s) {
      alert("로그인 페이지에서 먼저 입장해 주세요.");
      navigate("/");
      return;
    }
    setState(s);

    // 실전 모드이고 아직 시작 전이면 흰 화면 표시
    if (s.practiceMode?.type && !s.practiceMode.startedAt) {
      setShowWhiteScreen(true);
    }
  }, [navigate]);

  // 흰 화면: 1~7초 랜덤 딜레이 후 실전 모드 초기화
  useEffect(() => {
    if (!showWhiteScreen) return;

    const delay = (1 + Math.random() * 6) * 1000;

    const timer = setTimeout(async () => {
      const s = stateRef.current;
      if (!s?.practiceMode) {
        setShowWhiteScreen(false);
        return;
      }

      const startedAt = Date.now();
      const { type, difficulty } = s.practiceMode;

      // 마감 타이머 생성 대상: cartCourseIds + codeInputCourseIds (모드 공통)
      const deadlineTargets = [...s.cartCourseIds, ...s.codeInputCourseIds];

      const courseDeadlines = generateCourseDeadlines(deadlineTargets, difficulty, startedAt);

      // 챌린지 모드: Firebase 세션 시작 (serverTimestamp)
      let challengeDocId = null;
      if (type === "challenge") {
        try {
          challengeDocId = await startChallengeSession(
            s.practiceMode.nickname || "익명",
            CHALLENGE_ID
          );
        } catch (e) {
          console.error("Firebase 세션 시작 실패:", e);
        }
      }

      setState((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          practiceMode: {
            ...prev.practiceMode,
            startedAt,
            courseDeadlines,
            challengeDocId,
          },
        };
        saveState(next);
        return next;
      });

      setShowWhiteScreen(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [showWhiteScreen]);

  // 자동 전환 체크: 수강꾸러미 과목이 모두 신청 완료 or 마감됐을 때 결과 화면으로 이동
  useEffect(() => {
    if (showWhiteScreen || !state?.practiceMode?.startedAt) return;

    const s = stateRef.current;
    const pm = s?.practiceMode;
    if (!pm) return;

    const deadlines = pm.courseDeadlines || {};
    const checkTargets = [...s.cartCourseIds, ...s.codeInputCourseIds];

    const isAllDone = () => {
      const curr = stateRef.current;
      const now = Date.now();
      return checkTargets.every(
        (id) =>
          curr.registeredCourseIds.includes(id) ||
          (deadlines[id] && now > deadlines[id])
      );
    };

    if (isAllDone()) {
      handlePracticeEnd(stateRef.current);
      return;
    }

    // 다음 마감 시각에 재확인하는 타이머 설정
    const now = Date.now();
    const futureDeadlines = Object.values(deadlines).filter((d) => d > now);
    if (futureDeadlines.length === 0) return;

    const nextDeadline = Math.min(...futureDeadlines);
    const delay = Math.max(200, nextDeadline - Date.now() + 200);

    const timer = setTimeout(() => {
      if (isAllDone()) {
        handlePracticeEnd(stateRef.current);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    state?.practiceMode?.startedAt,
    state?.registeredCourseIds?.length,
    showWhiteScreen,
  ]);

  // 글로벌 타임아웃: 난이도별 제한 시간 경과 시 메인으로 강제 복귀 (실전 모드 전용)
  useEffect(() => {
    if (showWhiteScreen || !state?.practiceMode?.startedAt) return;
    const pm = stateRef.current?.practiceMode;
    if (!pm || pm.type !== "practice") return;

    const config = DIFFICULTY_CONFIGS[pm.difficulty] ?? DIFFICULTY_CONFIGS.medium;
    const timeoutMs = config.globalTimeout * 1000;
    const remaining = timeoutMs - (Date.now() - pm.startedAt);

    if (remaining <= 0) {
      if (!hasEndedRef.current) {
        hasEndedRef.current = true;
        alert("시간이 경과되어 모든 강좌가 마감되었습니다.");
        navigate("/");
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!hasEndedRef.current) {
        hasEndedRef.current = true;
        alert("시간이 경과되어 모든 강좌가 마감되었습니다.");
        navigate("/");
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, [state?.practiceMode?.startedAt, showWhiteScreen]);

  if (!state) return null;

  const totalCredits = state.registeredCourseIds.reduce(
    (sum, id) => sum + getCourseCredit(state.courses, id),
    0
  );

  function updateState(updater) {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }

  // 실전 모드 종료: 결과 저장 후 결과 화면으로 이동
  async function handlePracticeEnd(currentState) {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    const pm = currentState.practiceMode;
    const endedAt = Date.now();
    const deadlines = pm.courseDeadlines || {};

    const checkTargets = [...currentState.cartCourseIds, ...currentState.codeInputCourseIds];

    const registeredCourseIds = currentState.registeredCourseIds;
    const missedCourseIds = checkTargets.filter(
      (id) => !registeredCourseIds.includes(id)
    );

    const result = {
      type: pm.type,
      difficulty: pm.difficulty,
      nickname: pm.nickname,
      startedAt: pm.startedAt,
      endedAt,
      registeredCourseIds,
      missedCourseIds,
      courseTimings: pm.courseTimings || {},
      courses: currentState.courses,
      totalCartCount: currentState.cartCourseIds.length,
      totalCodeCount: currentState.codeInputCourseIds.length,
      challengeDocId: pm.challengeDocId,
    };

    // 챌린지 모드: Firebase endedAt + 결과 기록
    if (pm.type === "challenge" && pm.challengeDocId) {
      try {
        const registeredCredits = registeredCourseIds.reduce(
          (sum, id) => sum + (currentState.courses[id]?.credit ?? 3),
          0
        );
        const totalCount = checkTargets.length;
        const totalCreditsAll = checkTargets.reduce(
          (sum, id) => sum + (currentState.courses[id]?.credit ?? 3),
          0
        );
        await finishChallengeSession(pm.challengeDocId, {
          registeredCount: registeredCourseIds.length,
          registeredCredits,
          totalCount,
          totalCredits: totalCreditsAll,
          courseTimings: pm.courseTimings || {},
        });
      } catch (e) {
        console.error("Firebase 결과 저장 실패:", e);
      }
    }

    if (pm.type === "challenge") {
      try {
        localStorage.setItem(PRACTICE_RESULT_KEY, JSON.stringify(result));
      } catch (e) {
        console.error("결과 저장 실패:", e);
      }
      navigate("/result");
    } else {
      navigate("/result", { state: result });
    }
  }

  const handleApplyFromCart = (id) => {
    if (!check()) return;

    // 실전 모드: 마감 여부 확인
    if (state.practiceMode?.startedAt) {
      if (isClosed(id, state.practiceMode.courseDeadlines)) {
        alert("해당 강의는 마감되어 신청이 불가능합니다.");
        generate();
        return;
      }
    }

    const course = state.courses[id] || { id, name: "-", credit: 3 };
    const addCredit = getCourseCredit(state.courses, id);
    const current = totalCredits;
    const max = state.student.maxCredits;

    if (state.registeredCourseIds.includes(id)) {
      alert("이미 신청된 과목입니다.");
      return;
    }

    if (current + addCredit > max) {
      alert(
        `신청가능 학점을 초과합니다.\n현재 ${current}학점, 추가 ${addCredit}학점, 최대 ${max}학점`
      );
      return;
    }

    if (!confirm(`${course.name} 과목을 신청하시겠습니까?`)) return;

    const elapsed =
      state.practiceMode?.startedAt != null
        ? Date.now() - state.practiceMode.startedAt
        : null;

    updateState((prev) => {
      const next = { ...prev };
      next.registeredCourseIds = [...prev.registeredCourseIds, id];
      if (Array.isArray(next.codeInputCourseIds)) {
        next.codeInputCourseIds = next.codeInputCourseIds.filter((cid) => cid !== id);
      }
      if (elapsed !== null && next.practiceMode) {
        next.practiceMode = {
          ...prev.practiceMode,
          courseTimings: {
            ...prev.practiceMode.courseTimings,
            [id]: elapsed,
          },
        };
      }
      return next;
    });
    generate();
  };

  const handleAddByCode = (code) => {
    if (!check()) return false;

    // 실전 모드: 코드 입력 과목도 마감 확인
    if (state.practiceMode?.startedAt) {
      if (isClosed(code, state.practiceMode.courseDeadlines)) {
        alert("해당 강의는 마감되어 신청이 불가능합니다.");
        generate();
        return false;
      }
    }

    let course = state.courses[code];
    if (!course) {
      course = { id: code, name: "-", credit: 3 };
    }

    if (state.registeredCourseIds.includes(code)) {
      alert("이미 신청된 과목입니다.");
      return false;
    }

    const addCredit = getCourseCredit(state.courses, code);
    const current = totalCredits;
    const max = state.student.maxCredits;

    if (current + addCredit > max) {
      alert(
        `신청가능 학점을 초과합니다.\n현재 ${current}학점, 추가 ${addCredit}학점, 최대 ${max}학점`
      );
      return false;
    }

    if (!confirm(`${course.name} 과목을 신청하시겠습니까?`)) return false;

    const elapsed =
      state.practiceMode?.startedAt != null
        ? Date.now() - state.practiceMode.startedAt
        : null;

    updateState((prev) => {
      const next = { ...prev };
      if (!next.courses[code]) {
        next.courses = { ...prev.courses, [code]: { id: code, name: "-", credit: 3 } };
      }
      next.registeredCourseIds = [...prev.registeredCourseIds, code];
      if (Array.isArray(next.codeInputCourseIds)) {
        next.codeInputCourseIds = next.codeInputCourseIds.filter((cid) => cid !== code);
      }
      if (elapsed !== null && next.practiceMode) {
        next.practiceMode = {
          ...prev.practiceMode,
          courseTimings: {
            ...prev.practiceMode.courseTimings,
            [code]: elapsed,
          },
        };
      }
      return next;
    });
    generate();
    return true;
  };

  const handleDelete = (id) => {
    if (!check()) return;
    if (!confirm("해당 과목을 수강신청 목록에서 삭제하시겠습니까?")) return;

    updateState((prev) => ({
      ...prev,
      registeredCourseIds: prev.registeredCourseIds.filter((cid) => cid !== id),
    }));
    generate();
  };

  // 흰 화면 (실전 모드 진입 딜레이)
  if (showWhiteScreen) {
    return <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 9999 }} />;
  }

  const pm = state.practiceMode;
  const isPracticeActive = !!(pm?.type && pm?.startedAt);

  return (
    <>
      <MainNav />
      {isPracticeActive && (
        <PracticeTimer
          startedAt={pm.startedAt}
          difficulty={pm.difficulty}
          type={pm.type}
        />
      )}
      <main className="page-wrap">
        <StudentInfo student={state.student} totalCredits={totalCredits} />
        <CartCourses
          cartCourseIds={state.cartCourseIds}
          registeredIds={state.registeredCourseIds}
          courses={state.courses}
          onApply={handleApplyFromCart}
        />
        <Captcha
          value={captchaValue}
          inputValue={captchaInput}
          onChange={setCaptchaInput}
        />
        <CodeInput onAdd={handleAddByCode} />
        <RegisteredCourses
          registeredIds={state.registeredCourseIds}
          courses={state.courses}
          onDelete={handleDelete}
        />
      </main>
      <Footer variant="register" />
    </>
  );
}
