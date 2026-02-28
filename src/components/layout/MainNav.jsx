import { useNavigate } from "react-router-dom";

export default function MainNav() {
  const navigate = useNavigate();

  return (
    <nav className="main-nav">
      <div className="main-nav__inner">
        <div className="main-nav__item main-nav__item--active">수강신청</div>
        <button
          type="button"
          className="nav-logout-btn"
          onClick={() => navigate("/")}
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
