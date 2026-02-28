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
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>
            🏆 랭킹 도전 모드 — 랭킹
          </div>
          <div className="helper-text">
            도전 세트 v1 · 총 {TOTAL_COURSES}과목 / {TOTAL_CREDITS}학점
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div className="section-title" style={{ margin: 0 }}>
              전체 랭킹
            </div>
            <button className="btn btn-sm" onClick={load} disabled={loading}>
              {loading ? "불러오는 중..." : "새로고침"}
            </button>
          </div>

          {error && (
            <div style={{ color: "#e54b4b", fontSize: "13px", marginBottom: "8px" }}>
              {error}
            </div>
          )}

          {!loading && rankings.length === 0 && !error && (
            <div className="helper-text">아직 등록된 기록이 없습니다.</div>
          )}

          {rankings.length > 0 && (
            <div className="table-wrap">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>순위</th>
                    <th>닉네임</th>
                    <th>신청 성공</th>
                    <th>소요 시간</th>
                    <th style={{ width: "100px" }}>달성률</th>
                    <th>일시</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((row, idx) => {
                    const elapsedMs =
                      row.endedAt?.toMillis?.() - row.startedAt?.toMillis?.();
                    const elapsedSec = elapsedMs > 0 ? (elapsedMs / 1000).toFixed(1) : "-";
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

                    const isTop3 = idx < 3;

                    return (
                      <tr
                        key={row.id}
                        style={
                          isTop3
                            ? { background: idx === 0 ? "#fffbe6" : "#f5f5f7" }
                            : {}
                        }
                      >
                        <td>
                          <strong>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                          </strong>
                        </td>
                        <td>
                          <strong>{row.nickname}</strong>
                        </td>
                        <td>
                          {count}/{TOTAL_COURSES}개 ({credits}학점)
                        </td>
                        <td>
                          <strong style={{ color: "#478ef0" }}>{elapsedSec}초</strong>
                        </td>
                        <td>
                          <div
                            style={{
                              background: "#e8eef7",
                              borderRadius: "2px",
                              height: "12px",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                background: "#478ef0",
                                width: `${rate}%`,
                                height: "100%",
                                borderRadius: "2px",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                right: "4px",
                                top: "-1px",
                                fontSize: "10px",
                                color: "#555",
                              }}
                            >
                              {rate}%
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: "11px", color: "#777" }}>{dateStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          className="card"
          style={{ display: "flex", gap: "8px", justifyContent: "center" }}
        >
          <button
            className="btn btn-sm"
            style={{
              padding: "8px 24px",
              backgroundColor: "#e54b4b",
              color: "#fff",
              borderColor: "#e54b4b",
            }}
            onClick={() => navigate("/challenge")}
          >
            도전하기
          </button>
          <button
            className="btn btn-sm"
            style={{ padding: "8px 24px" }}
            onClick={() => navigate("/")}
          >
            설정 화면
          </button>
        </div>
      </main>
      <Footer variant="setup" />
    </>
  );
}
