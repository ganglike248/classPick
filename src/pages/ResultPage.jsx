import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRACTICE_RESULT_KEY, STORAGE_KEY, TRIAL_BACKUP_KEY } from "../utils/storage";
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
  const modeLabel = type === "challenge" ? "랭킹 도전 모드" : type === "trial" ? "체험 모드" : "일반 연습 모드";
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
    if (type === "trial") {
      const backup = localStorage.getItem(TRIAL_BACKUP_KEY);
      if (backup) {
        try { localStorage.setItem(STORAGE_KEY, backup); } catch (e) { /* ignore */ }
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      localStorage.removeItem(TRIAL_BACKUP_KEY);
    }
    navigate("/");
  };

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "700px" }}>
        {/* 헤더 - 소요 시간 히어로 */}
        <div className="card" style={{ textAlign: "center", padding: "32px 24px", borderTop: "3px solid #478ef0" }}>
          <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
            수강신청 결과
          </div>
          <div style={{ fontSize: "46px", fontWeight: 700, color: "#478ef0", letterSpacing: "-1px", lineHeight: 1 }}>
            {formatElapsedLong(totalElapsedMs)}
          </div>
          <div style={{ fontSize: "13px", color: "#b0b8cc", marginTop: "6px" }}>
            총 {(totalElapsedMs / 1000).toFixed(2)}초
          </div>
          <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "0", borderTop: "1px solid #f0f3fa", paddingTop: "16px" }}>
            <div style={{ flex: 1, padding: "0 12px", borderRight: "1px solid #f0f3fa" }}>
              <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "4px" }}>신청 성공</div>
              <div>
                <strong style={{ fontSize: "20px", color: "#478ef0" }}>{registeredCourseIds.length}</strong>
                <span style={{ fontSize: "12px", color: "#8c96ae" }}>/{totalTarget}개</span>
              </div>
            </div>
            {missedCourseIds.length > 0 && (
              <div style={{ flex: 1, padding: "0 12px", borderRight: "1px solid #f0f3fa" }}>
                <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "4px" }}>마감/미신청</div>
                <div>
                  <strong style={{ fontSize: "20px", color: "#e54b4b" }}>{missedCourseIds.length}</strong>
                  <span style={{ fontSize: "12px", color: "#8c96ae" }}>개</span>
                </div>
              </div>
            )}
            <div style={{ flex: 1, padding: "0 12px" }}>
              <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "4px" }}>모드 · 난이도</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                {modeLabel}{diffLabel ? ` · ${diffLabel}` : ""}
                {type === "challenge" && <div style={{ fontSize: "11px", color: "#8c96ae", fontWeight: 400 }}>{nickname}</div>}
              </div>
            </div>
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

        {/* 체험 모드 안내 */}
        {type === "trial" && (
          <div className="card" style={{ background: "#f0f7ff", border: "1px solid #c3daf9", borderLeft: "4px solid #478ef0", fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>
            이 기록은 저장되지 않는 <strong>일회용 체험</strong>이에요.<br />
            기존에 설정해둔 과목은 그대로 유지되니 걱정하지 않아도 돼요. 😊
          </div>
        )}

        {/* 버튼 */}
        <div className="card" style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-block"
            style={{
              padding: "11px 0",
              backgroundColor: "#478ef0",
              color: "#fff",
              borderColor: "#478ef0",
              fontWeight: 700,
              borderRadius: "6px",
            }}
            onClick={handleRetry}
          >
            처음으로
          </button>
          {type === "challenge" && (
            <button
              className="btn btn-block"
              style={{
                padding: "11px 0",
                backgroundColor: "#e54b4b",
                color: "#fff",
                borderColor: "#e54b4b",
                fontWeight: 700,
                borderRadius: "6px",
              }}
              onClick={() => navigate("/ranking")}
            >
              🏆 랭킹 보기
            </button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
