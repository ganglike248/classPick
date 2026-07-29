import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRACTICE_RESULT_KEY, STORAGE_KEY, TRIAL_BACKUP_KEY } from "../utils/storage";
import { DIFFICULTY_CONFIGS, formatElapsedMs, formatElapsedLong } from "../utils/practiceUtils";
import { fetchRankings } from "../utils/rankingUtils";
import { CHALLENGE_ID } from "../data/challengeData";
import { auth } from "../firebase";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";
import { trackPageView, trackChallengeRanking } from "../utils/analytics";
import AdFitBanner from "../components/common/AdFitBanner";

const ADFIT_UNIT_ID_CONTENT = import.meta.env.VITE_ADFIT_UNIT_ID_CONTENT;

const RANK_CARD_STYLE = {
  incomplete: { background: "#fff8f8", border: "1px solid #fac5c5", borderLeft: "4px solid #e54b4b" },
  new_best: { background: "#fffaf0", border: "1px solid #f2e2b8", borderLeft: "4px solid #ffb020" },
  not_best: { background: "#f5f7fd", border: "1px solid #e6eaf3", borderLeft: "4px solid #8c96ae" },
  unknown: { background: "#f5f7fd", border: "1px solid #e6eaf3", borderLeft: "4px solid #8c96ae" },
};

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  // 랭킹 도전 모드: 이번 기록이 랭킹판에 실제로 반영됐는지 여부
  // { status: "incomplete" | "new_best" | "not_best" | "unknown", rank, bestElapsedMs }
  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    trackPageView("ResultPage");
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

  // 랭킹 도전 모드 결과 추적
  useEffect(() => {
    if (result && result.type === "challenge") {
      const totalTime = result.endedAt - result.startedAt;
      trackChallengeRanking(result.nickname || "익명", result.registeredCourseIds.length, result.totalCartCount + result.totalCodeCount, totalTime);
    }
  }, [result]);

  // 랭킹 도전 모드: 이번 기록이 랭킹판에 실제로 반영됐는지 확인
  // (finishChallengeSession은 100% 완주했을 때만 호출되므로, 미완주면 조회할 필요도 없음 —
  //  미완주 여부는 result에서 바로 알 수 있어 별도 상태 없이 렌더링 시점에 판단한다)
  useEffect(() => {
    if (!result || result.type !== "challenge" || result.missedCourseIds.length > 0) return;

    let cancelled = false;
    fetchRankings(CHALLENGE_ID)
      .then((list) => {
        if (cancelled) return;
        const myUid = auth.currentUser?.uid;
        const idx = list.findIndex((r) => r.uid === myUid);
        if (idx === -1) {
          setRankInfo({ status: "unknown" });
          return;
        }
        const myRecord = list[idx];
        const bestElapsedMs = myRecord.endedAt?.toMillis?.() - myRecord.startedAt?.toMillis?.();
        setRankInfo({
          status: myRecord.id === result.challengeDocId ? "new_best" : "not_best",
          rank: idx + 1,
          bestElapsedMs,
        });
      })
      .catch((e) => {
        console.error("랭킹 반영 여부 확인 실패:", e);
        if (!cancelled) setRankInfo({ status: "unknown" });
      });
    return () => {
      cancelled = true;
    };
  }, [result]);

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

  const isIncomplete = missedCourseIds.length > 0;

  const handleRetry = () => {
    localStorage.removeItem(PRACTICE_RESULT_KEY);
    // 체험 모드와 랭킹 도전 모드는 임시 과목으로 기존 설정을 덮어썼으므로 원래 설정을 복원
    if (type === "trial" || type === "challenge") {
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
      <TopBand onBrandClick={handleRetry} />
      <main className="page-wrap" style={{ maxWidth: "700px" }}>
        {/* 헤더 - 소요 시간 히어로 (마감 시간 초과로 자동 종료된 경우엔 시간 대신 안내 문구) */}
        <div className="card" style={{ textAlign: "center", padding: "32px 24px", borderTop: `3px solid ${isIncomplete ? "#e54b4b" : "#478ef0"}` }}>
          <div style={{ fontSize: "11px", color: "#8c96ae", marginBottom: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
            수강신청 결과
          </div>
          {isIncomplete ? (
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#e54b4b", lineHeight: 1.5 }}>
              마감 시간이 지나 자동으로 종료됐어요
            </div>
          ) : (
            <>
              <div style={{ fontSize: "46px", fontWeight: 700, color: "#478ef0", letterSpacing: "-1px", lineHeight: 1 }}>
                {formatElapsedLong(totalElapsedMs)}
              </div>
              <div style={{ fontSize: "13px", color: "#b0b8cc", marginTop: "6px" }}>
                총 {(totalElapsedMs / 1000).toFixed(2)}초
              </div>
            </>
          )}
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <AdFitBanner unitId={ADFIT_UNIT_ID_CONTENT} width={728} height={90} />
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

        {/* 랭킹 도전 모드: 이번 기록이 랭킹에 반영됐는지 안내 */}
        {type === "challenge" && (
          <div
            className="card"
            style={{
              ...RANK_CARD_STYLE[isIncomplete ? "incomplete" : (rankInfo?.status ?? "unknown")],
              fontSize: "13px",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {isIncomplete && (
              <>
                <strong style={{ color: "#c0392b" }}>이 기록은 랭킹에 저장되지 않았어요</strong>
                <div>전 과목을 모두 신청해야 랭킹에 기록돼요. 하나라도 마감되면 기록되지 않아요.</div>
              </>
            )}

            {!isIncomplete && !rankInfo && <div className="helper-text">랭킹 반영 결과를 확인하는 중...</div>}

            {!isIncomplete && rankInfo?.status === "new_best" && (
              <>
                <strong style={{ color: "#b8860b" }}>🎉 개인 최고 기록 경신!</strong>
                <div>이번 기록이 내 최고 기록으로 랭킹에 반영됐어요. 현재 전체 <strong>{rankInfo.rank}위</strong>예요.</div>
              </>
            )}

            {rankInfo?.status === "not_best" && (
              <>
                <strong>이 기록은 랭킹에 반영되지 않았어요</strong>
                <div>
                  내 최고 기록은 <strong>{(rankInfo.bestElapsedMs / 1000).toFixed(2)}초</strong> (전체 {rankInfo.rank}위)예요.
                  이번 기록은 그보다 느려서, 랭킹판에는 계속 최고 기록만 표시돼요.
                </div>
              </>
            )}

            {rankInfo?.status === "unknown" && (
              <div className="helper-text">랭킹 반영 결과를 확인하지 못했어요. 랭킹 페이지에서 직접 확인해 주세요.</div>
            )}
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
