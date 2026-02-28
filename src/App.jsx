import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
import RegisterPage from "./pages/RegisterPage";
import PracticeLoginPage from "./pages/PracticeLoginPage";
import ResultPage from "./pages/ResultPage";
import ChallengePage from "./pages/ChallengePage";
import RankingPage from "./pages/RankingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/practice-login" element={<PracticeLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
