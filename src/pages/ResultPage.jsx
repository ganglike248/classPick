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
        {/* 헤더 */}
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            수강신청 결과
          </div>
          <div className="helper-text">
            {modeLabel} · 난이도 {diffLabel}
            {type === "challenge" && ` · 닉네임: ${nickname}`}
          </div>
        </div>

        {/* 요약 */}
        <div className="card">
          <div className="section-title">결과 요약</div>
          <table className="data-table info-table" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th style={{ textAlign: "left", width: "40%" }}>신청 성공</th>
                <td>
                  <strong style={{ color: "#478ef0" }}>
                    {registeredCourseIds.length}
                  </strong>{" "}
                  / {totalTarget}개 ({registeredCredits}학점)
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>마감 / 미신청</th>
                <td>
                  <strong style={{ color: missedCourseIds.length > 0 ? "#e54b4b" : "#333" }}>
                    {missedCourseIds.length}
                  </strong>
                  개
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>총 소요 시간</th>
                <td>
                  <strong>{formatElapsedLong(totalElapsedMs)}</strong>
                  <span className="helper-text"> ({(totalElapsedMs / 1000).toFixed(1)}초)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 신청 성공 과목 상세 */}
        <div className="card">
          <div className="section-title">신청 성공 과목</div>
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
        <div
          className="card"
          style={{ display: "flex", gap: "8px", justifyContent: "center" }}
        >
          <button
            className="btn btn-sm"
            style={{
              padding: "8px 24px",
              backgroundColor: "rgb(71,142,240)",
              color: "#fff",
              borderColor: "rgb(71,142,240)",
            }}
            onClick={handleRetry}
          >
            다시 하기
          </button>
          {type === "challenge" && (
            <button
              className="btn btn-sm"
              style={{
                padding: "8px 24px",
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
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
