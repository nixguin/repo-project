// ESPORT-21: lazy-load every route so only the current page's JS is parsed on first render
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Login            = lazy(() => import("./pages/Login"));
const PlayerDashboard  = lazy(() => import("./pages/PlayerDashboard"));
const EventsPage       = lazy(() => import("./pages/EventsPage"));
const TournamentBracket = lazy(() => import("./pages/TournamentBracket"));
const SponsorAnalytics = lazy(() => import("./pages/SponsorAnalytics"));
const AdminPanel       = lazy(() => import("./pages/AdminPanel"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-softgray flex items-center justify-center">
      <span className="text-cobalt text-sm animate-pulse">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PlayerDashboard />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/bracket" element={<TournamentBracket />} />
          <Route path="/sponsor" element={<SponsorAnalytics />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
