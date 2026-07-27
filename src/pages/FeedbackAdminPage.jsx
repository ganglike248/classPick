import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { fetchFeedbackList, deleteFeedback } from "../utils/feedbackUtils";
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

  useEffect(() => {
    if (isAdmin) loadMessages();
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

  const handleLogout = () => {
    signOut(auth);
  };

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
      </main>
      <Footer />
    </>
  );
}
