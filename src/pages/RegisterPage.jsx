import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/layout/MainNav";
import Footer from "../components/layout/Footer";
import StudentInfo from "../components/register/StudentInfo";
import CartCourses from "../components/register/CartCourses";
import Captcha from "../components/register/Captcha";
import CodeInput from "../components/register/CodeInput";
import RegisteredCourses from "../components/register/RegisteredCourses";
import { loadStoredState, saveState } from "../utils/storage";
import { useCaptcha } from "../hooks/useCaptcha";

function getCourseCredit(courses, id) {
  const c = courses[id];
  if (!c || typeof c.credit !== "number" || c.credit <= 0) return 3;
  return c.credit;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const { captchaValue, captchaInput, setCaptchaInput, generate, check } = useCaptcha();

  useEffect(() => {
    const s = loadStoredState();
    if (!s) {
      alert("로그인 페이지에서 먼저 입장해 주세요.");
      navigate("/");
      return;
    }
    setState(s);
  }, [navigate]);

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

  const handleApplyFromCart = (id) => {
    if (!check()) return;

    const course = state.courses[id] || { id, name: "-", credit: 3 };
    const addCredit = getCourseCredit(state.courses, id);
    const current = totalCredits;
    const max = state.student.maxCredits;

    if (state.registeredCourseIds.includes(id)) {
      alert("이미 신청된 과목입니다.");
      return;
    }

    if (current + addCredit > max) {
      alert(`신청가능 학점을 초과합니다.\n현재 ${current}학점, 추가 ${addCredit}학점, 최대 ${max}학점`);
      return;
    }

    if (!confirm(`${course.name} 과목을 신청하시겠습니까?`)) return;

    updateState((prev) => {
      const next = { ...prev };
      next.registeredCourseIds = [...prev.registeredCourseIds, id];
      if (Array.isArray(next.codeInputCourseIds)) {
        next.codeInputCourseIds = next.codeInputCourseIds.filter((cid) => cid !== id);
      }
      return next;
    });
    generate();
  };

  const handleAddByCode = (code) => {
    if (!check()) return false;

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
      alert(`신청가능 학점을 초과합니다.\n현재 ${current}학점, 추가 ${addCredit}학점, 최대 ${max}학점`);
      return false;
    }

    if (!confirm(`${course.name} 과목을 신청하시겠습니까?`)) return false;

    updateState((prev) => {
      const next = { ...prev };
      if (!next.courses[code]) {
        next.courses = { ...prev.courses, [code]: { id: code, name: "-", credit: 3 } };
      }
      next.registeredCourseIds = [...prev.registeredCourseIds, code];
      if (Array.isArray(next.codeInputCourseIds)) {
        next.codeInputCourseIds = next.codeInputCourseIds.filter((cid) => cid !== code);
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

  return (
    <>
      <MainNav />
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
