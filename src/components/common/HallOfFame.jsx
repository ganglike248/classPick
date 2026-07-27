import { useEffect, useState } from "react";
import { fetchRankings, backfillOwnSemesterIds } from "../../utils/rankingUtils";
import { CHALLENGE_ID } from "../../data/challengeData";
import { getSemesterId, getSemesterLabel, getSemesterRangeLabel } from "../../utils/semesterUtils";

const RANK_BAR_COLOR = { 0: "#ffd35c", 1: "#c7ccd6", 2: "#d9a06b" };
const RANK_ROW_BG = { 0: "#fff1cc", 1: "#f2f3f6", 2: "#f8ede0" };
const RANK_BAR_HEIGHT = { 0: "88px", 1: "64px", 2: "46px" };
const RANK_MEDAL = { 0: "🥇", 1: "🥈", 2: "🥉" };

function formatSec(r) {
  const ms = r.endedAt?.toMillis?.() - r.startedAt?.toMillis?.();
  return ms > 0 ? (ms / 1000).toFixed(2) : "-";
}

/**
 * 랭킹 도전 모드 상위 3위를 보여주는 공용 컴포넌트
 * semesterId       조회할 학기 (생략 시 현재 학기)
 * variant="list"   좁은 영역용 순위 목록 (홈 화면 사이드 패널)
 * variant="podium" 넓은 영역용 시상대 형태 (랭킹 도전 모드 페이지, 랭킹 페이지)
 * bordered         list variant에서 자체 테두리를 그릴지 여부
 *                  (바깥에 이미 카드/테두리가 있는 곳에 넣을 땐 false로 이중 테두리 방지)
 */
export default function HallOfFame({ semesterId = getSemesterId(), variant = "list", bordered = true }) {
  const [topThree, setTopThree] = useState([]);

  useEffect(() => {
    let cancelled = false;
    // 학기 구분 도입 이전 내 기록이 있다면 조용히 채워 넣은 뒤 명예의 전당을 불러옴
    backfillOwnSemesterIds()
      .catch((e) => console.error("semesterId 백필 실패:", e))
      .then(() => fetchRankings(CHALLENGE_ID, semesterId))
      .then((data) => {
        if (!cancelled) setTopThree(data.slice(0, 3));
      })
      .catch((e) => console.error("명예의 전당 로드 실패:", e));
    return () => {
      cancelled = true;
    };
  }, [semesterId]);

  const header = (
    <>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e2532" }}>
        🏅 명예의 전당
      </div>
      <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "10px" }}>
        {getSemesterLabel(semesterId)} ({getSemesterRangeLabel(semesterId)})
      </div>
    </>
  );

  const wrapperStyle =
    variant === "list" && bordered
      ? { border: "1px solid #e6eaf3", borderRadius: "10px", padding: "12px 14px" }
      : undefined;

  if (topThree.length === 0) {
    return (
      <div style={wrapperStyle}>
        {header}
        <div className="helper-text">아직 이번 학기 기록이 없어요. 첫 도전자가 되어보세요!</div>
      </div>
    );
  }

  if (variant === "podium") {
    const order = [1, 0, 2]; // 2위-1위-3위 순서로 배치 (가운데가 1위)
    return (
      <div>
        {header}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "10px", marginTop: "6px" }}>
          {order.map((rank) => {
            const r = topThree[rank];
            return (
              <div
                key={rank}
                style={{
                  flex: 1,
                  maxWidth: "150px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: r ? 1 : 0.35,
                }}
              >
                <div style={{ fontSize: rank === 0 ? "22px" : "18px" }}>{RANK_MEDAL[rank]}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "2px", textAlign: "center" }}>
                  {r ? r.nickname : "-"}
                </div>
                <div style={{ fontSize: "12px", color: "#478ef0", fontWeight: 700, marginBottom: "6px" }}>
                  {r ? `${formatSec(r)}초` : "-"}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: RANK_BAR_HEIGHT[rank],
                    background: RANK_BAR_COLOR[rank],
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "8px",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {rank + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // list variant (기본, 홈 화면 사이드 패널용)
  return (
    <div style={wrapperStyle}>
      {header}
      <div>
        {topThree.map((r, i) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: RANK_ROW_BG[i],
              borderRadius: "8px",
              padding: "6px 10px",
              marginBottom: i < topThree.length - 1 ? "6px" : 0,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: i === 0 ? "18px" : "14px" }}>{RANK_MEDAL[i]}</span>
              <span style={{ fontSize: "12px", fontWeight: i === 0 ? 700 : 500 }}>{r.nickname}</span>
            </span>
            <span style={{ color: "#478ef0", fontWeight: 700, fontSize: "12px" }}>{formatSec(r)}초</span>
          </div>
        ))}
      </div>
    </div>
  );
}
