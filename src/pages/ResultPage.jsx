import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRACTICE_RESULT_KEY } from "../utils/storage";
import { DIFFICULTY_CONFIGS, formatElapsedMs, formatElapsedLong } from "../utils/practiceUtils";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 연습 모드: navigate state로 전달된 결과 (로컬 저장 없음)
    if (location.state) {
      setResult(location.state);
      return;
    }
    // 랭킹 도전 모드: localStorage에서 읽기
    try {
      const raw = localStorage.getItem(PRACTICE_RESULT_KEY);
      if (!raw) {
        navigate("/");
        return;
      }
      setResult(JSON.parse(raw));
    } catch {
      navigate("/");
    }
  }, [navigate, location.state]);

  if (!result) return null;

  const {
    type,
    difficulty,
    nickname,
    startedAt,
    endedAt,
    registeredCourseIds,
    missedCourseIds,
    courseTimings,
    courses,
    totalCartCount,
    totalCodeCount,
  } = result;

  const totalElapsedMs = endedAt - startedAt;
  const diffLabel = DIFFICULTY_CONFIGS[difficulty]?.label ?? "";
  const modeLabel = type === "challenge" ? "랭킹 도전 모드" : "일반 연습 모드";
  const totalTarget = (totalCartCount ?? 0) + (type === "challenge" ? (totalCodeCount ?? 0) : 0);

  // 신청 성공 과목 목록 (courseTimings 기준 정렬)
  const registeredWithTime = registeredCourseIds.map((id) => ({
    id,
    name: courses[id]?.name ?? id,
    credit: courses[id]?.credit ?? 3,
    elapsedMs: courseTimings[id] ?? null,
  }));
  registeredWithTime.sort((a, b) => (a.elapsedMs ?? Infinity) - (b.elapsedMs ?? Infinity));

  const registeredCredits = registeredCourseIds.reduce(
    (sum, id) => sum + (courses[id]?.credit ?? 3),
    0
  );

  const handleRetry = () => {
    localStorage.removeItem(PRACTICE_RESULT_KEY);
    navigate("/");
  };

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "700px" }}>
        {/* 헤더 - 소요 시간 히어로 */}
        <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px" }}>
            수강신청 결과
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700, color: "#478ef0", letterSpacing: "-1px", lineHeight: 1 }}>
            {formatElapsedLong(totalElapsedMs)}
          </div>
          <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
            ({(totalElapsedMs / 1000).toFixed(2)}초)
          </div>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px" }}>
              신청 성공{" "}
              <strong style={{ color: "#478ef0" }}>{registeredCourseIds.length}</strong>
              <span className="helper-text">/{totalTarget}개</span>
            </span>
            {missedCourseIds.length > 0 && (
              <span style={{ fontSize: "13px" }}>
                마감/미신청{" "}
                <strong style={{ color: "#e54b4b" }}>{missedCourseIds.length}</strong>
                <span className="helper-text">개</span>
              </span>
            )}
            <span style={{ fontSize: "13px" }}>
              <span className="helper-text">{modeLabel} · 난이도 {diffLabel}</span>
              {type === "challenge" && (
                <span className="helper-text"> · {nickname}</span>
              )}
            </span>
          </div>
        </div>

        {/* 신청 성공 과목 상세 */}
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center" }}>
            신청 성공 과목
            {registeredWithTime.length > 0 && (
              <span className="badge">{registeredWithTime.length}개 · {registeredCredits}학점</span>
            )}
          </div>
          {registeredWithTime.length === 0 ? (
            <div className="helper-text">신청된 과목이 없습니다.</div>
          ) : (
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>강좌번호</th>
                  <th>교과목명</th>
                  <th>학점</th>
                  <th>신청 소요 시간</th>
                </tr>
              </thead>
              <tbody>
                {registeredWithTime.map(({ id, name, credit, elapsedMs }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td className="text-left">{name}</td>
                    <td>{credit}</td>
                    <td>
                      {elapsedMs != null ? (
                        <span style={{ color: "#478ef0", fontWeight: 600 }}>
                          +{formatElapsedMs(elapsedMs)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 마감 / 미신청 과목 */}
        {missedCourseIds.length > 0 && (
          <div className="card">
            <div className="section-title">마감 / 미신청 과목</div>
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>강좌번호</th>
                  <th>교과목명</th>
                  <th>학점</th>
                </tr>
              </thead>
              <tbody>
                {missedCourseIds.map((id) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td className="text-left">{courses[id]?.name ?? id}</td>
                    <td>{courses[id]?.credit ?? 3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 버튼 */}
        <div className="card" style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-block"
            style={{
              padding: "10px 0",
              backgroundColor: "rgb(71,142,240)",
              color: "#fff",
              borderColor: "rgb(71,142,240)",
              fontWeight: 600,
            }}
            onClick={handleRetry}
          >
            처음으로
          </button>
          {type === "challenge" && (
            <button
              className="btn btn-block"
              style={{
                padding: "10px 0",
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
                fontWeight: 600,
              }}
              onClick={() => navigate("/ranking")}
            >
              🏆 랭킹 보기
            </button>
          )}
        </div>
      </main>
      <Footer variant="setup" />
    </>
  );
}
