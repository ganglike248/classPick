import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRankings, renameOwnRecord, deleteOwnRecord } from "../utils/rankingUtils";
import { CHALLENGE_ID, CHALLENGE_CART_COURSES, CHALLENGE_CODE_COURSES } from "../data/challengeData";
import { saveNickname } from "../utils/storage";
import { getRecentVersionIds } from "../utils/versionUtils";
import { auth } from "../firebase";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";
import HallOfFame from "../components/common/HallOfFame";
import { trackPageView, trackUIInteraction } from "../utils/analytics";
import AdFitBanner from "../components/common/AdFitBanner";

// ResultPage와 같은 광고 단위를 공유하면, 같은 세션에서 짧은 시간 안에 같은
// 단위 ID가 반복 요청되는 걸로 보여 뒤에 요청한 쪽이 채워지지 않을 수 있다.
// 그래서 랭킹 페이지 전용 단위를 따로 쓴다 (아직 없으면 CONTENT 값을 그대로
// 재사용 — 광고 단위 발급 전에는 기존과 동일하게 동작).
const ADFIT_UNIT_ID_RANKING =
  import.meta.env.VITE_ADFIT_UNIT_ID_RANKING ||
  import.meta.env.VITE_ADFIT_UNIT_ID_CONTENT;

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
  const [versionId, setVersionId] = useState(CHALLENGE_ID);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const versionOptions = getRecentVersionIds(4);

  const load = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRankings(versionId, { forceRefresh });
      setAllRankings(data.map((r, i) => ({ ...r, rank: i })));
    } catch (e) {
      console.error(e);
      setError("랭킹을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackPageView("RankingPage");
  }, []);

  // 버전이 바뀔 때마다 해당 버전 랭킹을 다시 불러옴
  useEffect(() => {
    load();
  }, [versionId]);

  // 검색/정렬/버전 변경 시 표시 개수 초기화
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, sortMode, versionId]);

  const myUid = auth.currentUser?.uid;
  const myRecord = myUid ? allRankings.find((r) => r.uid === myUid) : null;

  const handleRename = async () => {
    if (!myRecord) return;
    const newName = prompt("새 닉네임을 입력하세요 (최대 12자):", myRecord.nickname || "");
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    if (trimmed.length > 12) {
      alert("닉네임은 최대 12자까지 입력 가능합니다.");
      return;
    }
    try {
      await renameOwnRecord(myRecord.id, trimmed);
      saveNickname(trimmed);
      await load();
    } catch (e) {
      console.error("닉네임 변경 실패:", e);
      alert("닉네임 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleDeleteMine = async () => {
    if (!myRecord) return;
    if (!confirm("내 랭킹 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;
    try {
      await deleteOwnRecord(myRecord.id);
      await load();
    } catch (e) {
      console.error("기록 삭제 실패:", e);
      alert("기록 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

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
        {/* 헤더 — 타이틀+버전 선택을 한 줄에, 액션 버튼도 스크롤 없이 바로 보이도록 같은 카드에 배치 */}
        <div className="card" style={{ padding: "24px", borderTop: "3px solid #e54b4b" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              🏆 랭킹
            </div>
            <select
              className="input-text"
              value={versionId}
              onChange={(e) => setVersionId(e.target.value)}
              style={{ padding: "6px 10px", fontSize: "13px", width: "auto", cursor: "pointer" }}
            >
              {versionOptions.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: "12px", color: "#8c96ae", marginTop: "6px" }}>
            {TOTAL_COURSES}과목 · {TOTAL_CREDITS}학점
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
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
              홈 화면으로
            </button>
          </div>
        </div>

        {/* 명예의 전당 — 선택한 버전에 맞춰 갱신됨 (버전 참고사항은 HallOfFame 헤더에서 표시) */}
        <div className="card">
          <HallOfFame versionId={versionId} variant="podium" />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <AdFitBanner unitId={ADFIT_UNIT_ID_RANKING} width={728} height={90} />
        </div>

        {/* 내 기록 요약 */}
        {myRecord && (() => {
          const myElapsedMs = myRecord.endedAt?.toMillis?.() - myRecord.startedAt?.toMillis?.();
          const myElapsedSec = myElapsedMs > 0 ? (myElapsedMs / 1000).toFixed(2) : "-";
          return (
            <div className="card" style={{ borderLeft: "4px solid #478ef0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#8c96ae", marginBottom: "2px" }}>내 최고 기록</div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>
                    <span style={{ color: "#478ef0" }}>{myElapsedSec}초</span>
                    <span style={{ color: "#8c96ae", fontWeight: 500 }}> · 전체 {myRecord.rank + 1}위 · {myRecord.nickname}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn btn-sm" onClick={handleRename}>닉네임 변경</button>
                  <button className="btn btn-sm btn-danger" onClick={handleDeleteMine}>기록 삭제</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 랭킹 테이블 */}
        <div className="card">
          <div className="section-header">
            <div className="section-title" style={{ margin: 0 }}>
              전체 순위
              {allRankings.length > 0 && (
                <span className="badge">{allRankings.length}명</span>
              )}
            </div>
            <button className="btn btn-sm" onClick={() => load(true)} disabled={loading}>
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
              {versionId}에는 아직 등록된 기록이 없습니다.
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
                    const isMine = myUid && row.uid === myUid;
                    const rowBg = isMine
                      ? "#eef6ff"
                      : rank === 0 ? "#fffaed" : rank === 1 ? "#f8f9fb" : rank === 2 ? "#f5f7fa" : undefined;

                    return (
                      <tr key={row.id} style={rowBg ? { background: rowBg } : {}}>
                        <td>
                          <strong style={{ fontSize: rank < 3 ? "17px" : "13px" }}>
                            {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : rank + 1}
                          </strong>
                        </td>
                        <td>
                          <strong style={{ color: rank === 0 ? "#c47a00" : "#1e2532" }}>{row.nickname}</strong>
                          {isMine && (
                            <span className="badge" style={{ marginLeft: "6px", backgroundColor: "#478ef0", color: "#fff" }}>나</span>
                          )}
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

      </main>
      <Footer />
    </>
  );
}
