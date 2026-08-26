import { useNavigate } from "react-router-dom";

// 더미 탭(수강안내 등)은 실제 수강신청 화면의 UI를 그대로 재현하기 위한 장식 요소로,
// 이 연습 시스템에는 대응하는 화면이 없어 클릭해도 아무 동작을 하지 않는다.
const DUMMY_TABS = ["수강안내", "강의시간표 조회", "강의시간표 변경안내"];

export default function MainNav() {
  const navigate = useNavigate();

  return (
    <>
      <header className="main-nav">
        <div className="main-nav__inner">
          <div className="main-nav__brand">
            <span className="main-nav__logo" aria-hidden="true">
              🎓
            </span>
            <span className="main-nav__brand-text">
              Class Pick
              <br />
              - 계명대학교 수강신청
            </span>
          </div>
          <div className="main-nav__tabs">
            <div className="main-nav__item main-nav__item--active">
              <span>수강신청</span>
            </div>
            {DUMMY_TABS.map((label) => (
              <div
                key={label}
                className="main-nav__item main-nav__item--dummy"
                title="연습 시스템에는 없는 화면입니다"
              >
                {/* .main-nav__item은 flex 컨테이너라 자식 각각이 flex item이 되어
                    가로로 나열되므로, <br/> 줄바꿈이 그 안에서 먹히도록 텍스트
                    전체를 span 하나로 한 번 더 감싼다 (flex item은 이 span 1개뿐). */}
                <span>
                  {label.split(" ").map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>
      <div className="main-nav__notice-bar">
        <div className="main-nav__notice">
          ▶ 5분 후 <span className="main-nav__notice-link">자동로그아웃</span>
          됩니다. 개인정보 보호를 위하여 반드시 'logout' 하십시오.
        </div>
        <button
          type="button"
          className="nav-logout-btn"
          onClick={() => {
            if (confirm("정말 로그아웃 하시겠습니까?")) navigate("/");
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  );
}
