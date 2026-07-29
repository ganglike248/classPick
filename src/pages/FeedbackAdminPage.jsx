import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { fetchFeedbackList, deleteFeedback } from "../utils/feedbackUtils";
import { fetchAllRankingsForAdmin, adminDeleteRecord } from "../utils/rankingUtils";
import { FEEDBACK_ADMIN_EMAIL } from "../constants/site";
import TopBand from "../components/layout/TopBand";
import Footer from "../components/layout/Footer";

export default function FeedbackAdminPage() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [rankingLoadError, setRankingLoadError] = useState("");
  const [rankingSearch, setRankingSearch] = useState("");
  const [rankingVersionFilter, setRankingVersionFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // 화면 표시는 이 값으로 판단하지만, 실제 데이터 보호는 firestore.rules가 담당한다
  // (여기서 true로 조작해봤자 규칙이 거부하면 목록/삭제는 실패한다)
  const isAdmin = !!user && !user.isAnonymous && user.email === FEEDBACK_ADMIN_EMAIL;

  const loadMessages = async () => {
    setLoadingMessages(true);
    setLoadError("");
    try {
      const list = await fetchFeedbackList();
      setMessages(list);
    } catch (e) {
      console.error("피드백 목록 조회 실패:", e);
      setLoadError("목록을 불러오지 못했어요.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadRankings = async () => {
    setLoadingRankings(true);
    setRankingLoadError("");
    try {
      const list = await fetchAllRankingsForAdmin();
      setRankings(list);
    } catch (e) {
      console.error("랭킹 기록 조회 실패:", e);
      setRankingLoadError("목록을 불러오지 못했어요.");
    } finally {
      setLoadingRankings(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadMessages();
      loadRankings();
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    if (!password) {
      setLoginError("비밀번호를 입력해 주세요.");
      return;
    }
    setLoggingIn(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, FEEDBACK_ADMIN_EMAIL, password);
      setPassword("");
    } catch (e) {
      console.error("관리자 로그인 실패:", e);
      setLoginError("비밀번호가 올바르지 않아요.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("이 메시지를 삭제하시겠습니까?")) return;
    try {
      await deleteFeedback(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했어요.");
    }
  };

  const handleDeleteRanking = async (id, nickname) => {
    if (!confirm(`"${nickname}"님의 랭킹 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      await adminDeleteRecord(id);
      setRankings((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("랭킹 기록 삭제 실패:", e);
      alert("삭제에 실패했어요.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // 실제로 기록이 존재하는 버전만 옵션으로 보여줌 (최신순)
  const rankingVersions = [...new Set(rankings.map((r) => r.challengeId))].sort().reverse();

  const filteredRankings = rankings
    .filter((r) => rankingVersionFilter === "all" || r.challengeId === rankingVersionFilter)
    .filter((r) => r.nickname?.toLowerCase().includes(rankingSearch.toLowerCase()));

  if (!authChecked) return null;

  return (
    <>
      <TopBand />
      <main className="page-wrap" style={{ maxWidth: "700px" }}>
        {!isAdmin ? (
          <div className="card" style={{ maxWidth: "340px", margin: "40px auto" }}>
            <div className="section-title">관리자 로그인</div>
            <div className="helper-text" style={{ marginBottom: "12px" }}>
              피드백 메시지를 보려면 로그인하세요.
            </div>
            <input
              type="password"
              className="input-text"
              style={{ width: "100%", marginBottom: "8px" }}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {loginError && (
              <div className="helper-text" style={{ color: "#e54b4b", marginBottom: "8px" }}>
                {loginError}
              </div>
            )}
            <button
              className="btn btn-primary btn-block"
              style={{ backgroundColor: "#478ef0", color: "#fff", borderColor: "#478ef0" }}
              onClick={handleLogin}
              disabled={loggingIn}
            >
              {loggingIn ? "확인 중..." : "로그인"}
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="section-header">
              <div className="section-title" style={{ margin: 0 }}>
                피드백 목록
                {messages.length > 0 && <span className="badge">{messages.length}건</span>}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button className="btn btn-sm" onClick={loadMessages} disabled={loadingMessages}>
                  {loadingMessages ? "불러오는 중..." : "새로고침"}
                </button>
                <button className="btn btn-sm" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>

            {loadError && (
              <div className="info-callout--warn" style={{ borderRadius: "4px" }}>
                {loadError}
              </div>
            )}

            {!loadingMessages && messages.length === 0 && !loadError && (
              <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
                아직 받은 메시지가 없어요.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((m) => (
                <div key={m.id} style={{ border: "1px solid #e6eaf3", borderRadius: "8px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "13px", color: "#374151", whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                    {m.message}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="helper-text">
                      {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString("ko-KR") : "-"}
                    </span>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="card">
            <div className="section-header">
              <div className="section-title" style={{ margin: 0 }}>
                랭킹 기록 관리
                {rankings.length > 0 && <span className="badge">{rankings.length}건</span>}
              </div>
              <button className="btn btn-sm" onClick={loadRankings} disabled={loadingRankings}>
                {loadingRankings ? "불러오는 중..." : "새로고침"}
              </button>
            </div>
            <div className="helper-text" style={{ marginBottom: "10px" }}>
              부적절한 닉네임 등 신고받은 기록을 여기서 바로 삭제할 수 있어요. 닉네임 검색과 버전 필터로 좁혀볼 수 있어요.
            </div>

            {rankingLoadError && (
              <div className="info-callout--warn" style={{ borderRadius: "4px" }}>
                {rankingLoadError}
              </div>
            )}

            {!loadingRankings && rankings.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  className="input-text"
                  placeholder="닉네임 검색..."
                  value={rankingSearch}
                  onChange={(e) => setRankingSearch(e.target.value)}
                  style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}
                />
                <select
                  className="input-text"
                  value={rankingVersionFilter}
                  onChange={(e) => setRankingVersionFilter(e.target.value)}
                  style={{ padding: "6px 10px", fontSize: "13px", width: "auto", cursor: "pointer" }}
                >
                  <option value="all">전체 버전</option>
                  {rankingVersions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            {!loadingRankings && rankings.length === 0 && !rankingLoadError && (
              <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
                아직 등록된 랭킹 기록이 없어요.
              </div>
            )}

            {!loadingRankings && rankings.length > 0 && filteredRankings.length === 0 && (
              <div className="helper-text" style={{ textAlign: "center", padding: "16px 0" }}>
                조건과 일치하는 기록이 없어요.
              </div>
            )}

            {filteredRankings.length > 0 && (
              <div className="table-wrap">
                <table className="data-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>닉네임</th>
                      <th>버전</th>
                      <th>소요 시간</th>
                      <th>일시</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRankings.map((r) => {
                      const elapsedMs = r.endedAt?.toMillis?.() - r.startedAt?.toMillis?.();
                      const elapsedSec = elapsedMs > 0 ? (elapsedMs / 1000).toFixed(2) : "-";
                      const dateStr = r.endedAt?.toDate
                        ? r.endedAt.toDate().toLocaleString("ko-KR")
                        : "-";
                      return (
                        <tr key={r.id}>
                          <td className="text-left">{r.nickname}</td>
                          <td>{r.challengeId}</td>
                          <td>{elapsedSec}초</td>
                          <td style={{ fontSize: "11px", color: "#8c96ae" }}>{dateStr}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteRanking(r.id, r.nickname)}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
