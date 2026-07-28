import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
import RegisterPage from "./pages/RegisterPage";
import PracticeLoginPage from "./pages/PracticeLoginPage";
import ResultPage from "./pages/ResultPage";
import ChallengePage from "./pages/ChallengePage";
import RankingPage from "./pages/RankingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FeedbackAdminPage from "./pages/FeedbackAdminPage";
import AdFitBanner from "./components/common/AdFitBanner";
import "./styles/global.css";

const ADFIT_ANCHOR_UNIT_ID = import.meta.env.VITE_ADFIT_UNIT_ID_ANCHOR;

function AppRoutes() {
  const location = useLocation();
  // 실제 수강신청을 시간 압박 속에서 재현하는 화면이라, 광고로 주의를 뺏거나
  // 화면을 가리지 않도록 여기서만 하단 고정(앵커) 배너를 노출하지 않음
  const hideAnchorAd = location.pathname === "/register";

  return (
    <>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/practice-login" element={<PracticeLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/feedback" element={<FeedbackAdminPage />} />
      </Routes>
      {!hideAnchorAd && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 500,
            display: "flex",
            justifyContent: "center",
            background: "rgba(255,255,255,0.96)",
            borderTop: "1px solid #e6eaf3",
            padding: "4px 0",
          }}
        >
          {/* 애드핏 PC 웹 매체는 '앵커 배너' 상품이 따로 없어 일반 배너 단위를
              직접 하단에 고정시켜 앵커 배너처럼 보이게 함 */}
          <AdFitBanner unitId={ADFIT_ANCHOR_UNIT_ID} width={728} height={90} />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
