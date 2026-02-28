import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRankings } from "../utils/rankingUtils";
import { CHALLENGE_ID, CHALLENGE_CART_COURSES, CHALLENGE_CODE_COURSES } from "../data/challengeData";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

const TOTAL_COURSES =
  CHALLENGE_CART_COURSES.length + CHALLENGE_CODE_COURSES.length;
const TOTAL_CREDITS =
  [...CHALLENGE_CART_COURSES, ...CHALLENGE_CODE_COURSES].reduce(
    (s, c) => s + c.credit,
    0
  );
const PAGE_SIZE = 100;

export default function RankingPage() {
  const navigate = useNavigate();
  const [allRankings, setAllRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("time"); // "time" | "recent"
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRankings(CHALLENGE_ID);
      setAllRankings(data.map((r, i) => ({ ...r, rank: i })));
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

  // 검색/정렬 변경 시 표시 개수 초기화
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, sortMode]);

  const filtered = allRankings.filter((r) =>
    r.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted =
    sortMode === "recent"
      ? [...filtered].sort(
          (a, b) => (b.endedAt?.toMillis?.() ?? 0) - (a.endedAt?.toMillis?.() ?? 0)
        )
      : filtered; // fetchRankings에서 이미 시간순 정렬

  const visible = sorted.slice(0, displayCount);
  const hasMore = displayCount < sorted.length;

  // 무한 스크롤
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

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
              {allRankings.length > 0 && (
                <span className="badge">{allRankings.length}명</span>
              )}
            </div>
            <button className="btn btn-sm" onClick={load} disabled={loading}>
              {loading ? "불러오는 중..." : "새로고침"}
            </button>
          </div>

          {/* 검색 + 정렬 */}
          {!loading && allRankings.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
              <input
                type="text"
                className="input-text"
                placeholder="닉네임 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}
              />
              <select
                className="input-text"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                style={{ padding: "6px 10px", fontSize: "13px", width: "auto", cursor: "pointer" }}
              >
                <option value="time">소요 시간순</option>
                <option value="recent">최신순</option>
              </select>
            </div>
          )}

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

          {!loading && allRankings.length === 0 && !error && (
            <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
              아직 등록된 기록이 없습니다.
            </div>
          )}

          {!loading && allRankings.length > 0 && filtered.length === 0 && (
            <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
              "{searchQuery}"와 일치하는 닉네임이 없습니다.
            </div>
          )}

          {visible.length > 0 && (
            <div className="table-wrap">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "48px" }}>순위</th>
                    <th>닉네임</th>
                    <th>소요 시간</th>
                    <th>일시</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const elapsedMs =
                      row.endedAt?.toMillis?.() - row.startedAt?.toMillis?.();
                    const elapsedSec = elapsedMs > 0 ? (elapsedMs / 1000).toFixed(2) : "-";
                    const dateStr = row.endedAt?.toDate
                      ? row.endedAt.toDate().toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-";

                    const rank = row.rank;
                    const rowBg =
                      rank === 0 ? "#fffaed" : rank === 1 ? "#f8f9fb" : rank === 2 ? "#f5f7fa" : undefined;

                    return (
                      <tr key={row.id} style={rowBg ? { background: rowBg } : {}}>
                        <td>
                          <strong style={{ fontSize: rank < 3 ? "17px" : "13px" }}>
                            {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : rank + 1}
                          </strong>
                        </td>
                        <td>
                          <strong style={{ color: rank === 0 ? "#c47a00" : "#1e2532" }}>{row.nickname}</strong>
                        </td>
                        <td>
                          <strong style={{ color: "#478ef0" }}>{elapsedSec}초</strong>
                        </td>
                        <td style={{ fontSize: "11px", color: "#8c96ae" }}>{dateStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 무한 스크롤 감지 */}
              {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}
              {!hasMore && sorted.length > PAGE_SIZE && (
                <div className="helper-text" style={{ textAlign: "center", padding: "10px 0" }}>
                  전체 {sorted.length}명 표시 완료
                </div>
              )}
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
