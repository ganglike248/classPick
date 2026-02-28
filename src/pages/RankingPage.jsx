import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRankings } from "../utils/rankingUtils";
import { CHALLENGE_ID, CHALLENGE_CART_COURSES, CHALLENGE_CODE_COURSES } from "../data/challengeData";
import { DIFFICULTY_CONFIGS } from "../utils/practiceUtils";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

const TOTAL_COURSES =
  CHALLENGE_CART_COURSES.length + CHALLENGE_CODE_COURSES.length;
const TOTAL_CREDITS =
  [...CHALLENGE_CART_COURSES, ...CHALLENGE_CODE_COURSES].reduce(
    (s, c) => s + c.credit,
    0
  );

export default function RankingPage() {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRankings(CHALLENGE_ID);
      setRankings(data);
    } catch (e) {
      console.error(e);
      setError("랭킹을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const diffConfig = DIFFICULTY_CONFIGS[CHALLENGE_ID] ?? DIFFICULTY_CONFIGS.medium;

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "800px" }}>
        {/* 헤더 */}
        <div className="card" style={{ textAlign: "center", padding: "28px 24px", borderTop: "3px solid #e54b4b" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px", letterSpacing: "-0.5px" }}>
            🏆 랭킹
          </div>
          <div style={{ fontSize: "13px", color: "#8c96ae" }}>
            도전 세트 v1 &nbsp;·&nbsp; {TOTAL_COURSES}과목 &nbsp;·&nbsp; {TOTAL_CREDITS}학점
          </div>
        </div>

        {/* 랭킹 테이블 */}
        <div className="card">
          <div className="section-header">
            <div className="section-title" style={{ margin: 0 }}>
              전체 순위
              {rankings.length > 0 && (
                <span className="badge">{rankings.length}명</span>
              )}
            </div>
            <button className="btn btn-sm" onClick={load} disabled={loading}>
              {loading ? "불러오는 중..." : "새로고침"}
            </button>
          </div>

          {loading && (
            <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
              랭킹을 불러오는 중입니다...
            </div>
          )}

          {error && !loading && (
            <div className="info-callout--warn" style={{ borderRadius: "3px" }}>
              {error}
            </div>
          )}

          {!loading && rankings.length === 0 && !error && (
            <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
              아직 등록된 기록이 없습니다.
            </div>
          )}

          {rankings.length > 0 && (
            <div className="table-wrap">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "48px" }}>순위</th>
                    <th>닉네임</th>
                    <th>신청 성공</th>
                    <th>소요 시간</th>
                    <th style={{ width: "90px" }}>달성률</th>
                    <th>일시</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((row, idx) => {
                    const elapsedMs =
                      row.endedAt?.toMillis?.() - row.startedAt?.toMillis?.();
                    const elapsedSec = elapsedMs > 0 ? (elapsedMs / 1000).toFixed(2) : "-";
                    const count = row.result?.registeredCount ?? 0;
                    const credits = row.result?.registeredCredits ?? 0;
                    const rate =
                      TOTAL_COURSES > 0
                        ? Math.round((count / TOTAL_COURSES) * 100)
                        : 0;
                    const dateStr = row.endedAt?.toDate
                      ? row.endedAt.toDate().toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-";

                    const rowBg =
                      idx === 0 ? "#fffaed" : idx === 1 ? "#f8f9fb" : idx === 2 ? "#f5f7fa" : undefined;

                    return (
                      <tr key={row.id} style={rowBg ? { background: rowBg } : {}}>
                        <td>
                          <strong style={{ fontSize: idx < 3 ? "17px" : "13px" }}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                          </strong>
                        </td>
                        <td>
                          <strong style={{ color: idx === 0 ? "#c47a00" : "#1e2532" }}>{row.nickname}</strong>
                        </td>
                        <td>
                          <strong style={{ color: count === TOTAL_COURSES ? "#478ef0" : "#374151" }}>
                            {count}
                          </strong>
                          <span className="helper-text">/{TOTAL_COURSES}개 ({credits}학점)</span>
                        </td>
                        <td>
                          <strong style={{ color: "#478ef0" }}>{elapsedSec}초</strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <div
                              style={{
                                flex: 1,
                                background: "#eef3fd",
                                borderRadius: "4px",
                                height: "7px",
                              }}
                            >
                              <div
                                style={{
                                  background: rate === 100 ? "#478ef0" : "#93b8f0",
                                  width: `${rate}%`,
                                  height: "100%",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "10px", color: "#8c96ae", minWidth: "28px" }}>
                              {rate}%
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: "11px", color: "#8c96ae" }}>{dateStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="card" style={{ display: "flex", gap: "8px" }}>
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
            onClick={() => navigate("/challenge")}
          >
            🏁 도전하기
          </button>
          <button
            className="btn btn-block"
            style={{ padding: "11px 0", borderRadius: "6px" }}
            onClick={() => navigate("/")}
          >
            설정 화면으로
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
