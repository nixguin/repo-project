import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PlayerDashboard from "./pages/PlayerDashboard";
import TournamentBracket from "./pages/TournamentBracket";
import SponsorAnalytics from "./pages/SponsorAnalytics";
import AdminPanel from "./pages/AdminPanel";
import EventsPage from "./pages/EventsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PlayerDashboard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/bracket" element={<TournamentBracket />} />
        <Route path="/sponsor" element={<SponsorAnalytics />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
