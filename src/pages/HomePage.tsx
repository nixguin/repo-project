import { Link } from "react-router-dom";
import fgcuLogo from "../assets/fgcu-logo-250h.jpg";
import { events, type GameEvent } from "../data/mockData";

const gameIcons: Record<string, string> = {
  Valorant: "🎯",
  "Rocket League": "🚀",
  "Super Smash Bros. Ultimate": "🕹️",
  "League of Legends": "⚔️",
  "Overwatch 2": "🛡️",
  "Mario Kart 8 Deluxe": "🏎️",
};

const statusStyle: Record<GameEvent["status"], string> = {
  upcoming: "bg-cobalt/10 text-cobalt",
  live: "bg-yellow-100 text-yellow-700 animate-pulse",
  completed: "bg-gray-100 text-gray-500",
};

export default function HomePage() {
  const sortOrder: Record<GameEvent["status"], number> = { live: 0, upcoming: 1, completed: 2 };
  const preview = [...events]
    .sort((a, b) => sortOrder[a.status] - sortOrder[b.status])
    .filter((e) => e.status !== "completed")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-softgray flex flex-col">
      {/* ── Top nav ── */}
      <header className="bg-cobalt px-6 py-3 flex items-center justify-between">
        <div className="bg-white rounded-md px-2 py-1">
          <img src={fgcuLogo} alt="FGCU" className="h-8 w-auto" />
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/events" className="text-white/70 hover:text-white text-sm transition-colors">
            Browse Events
          </Link>
          <Link
            to="/login"
            className="bg-fgcu-emerald hover:bg-fgcu-emerald-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="bg-cobalt text-white px-4 sm:px-6 py-10 sm:py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
          Compete. Connect. Represent FGCU.
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
          Florida Gulf Coast University Esports — tournament brackets, ELO rankings,
          and event sign-up all in one place.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/events"
            className="bg-fgcu-emerald hover:bg-fgcu-emerald-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Browse All Events
          </Link>
          <Link
            to="/login"
            className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Upcoming Events preview ── */}
      <section className="max-w-4xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-cobalt">Upcoming Events</h2>
          <Link to="/events" className="text-sm text-fgcu-emerald hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {preview.map((ev) => (
            <div
              key={ev.id}
              className={`bg-white border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${
                ev.status === "live" ? "border-yellow-400" : "border-gray-200"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-base">{gameIcons[ev.game] ?? "🎮"}</span>
                  <span className="font-semibold text-gray-900 text-sm truncate">{ev.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyle[ev.status]}`}
                  >
                    {ev.status === "live" ? "🔴 Live" : "Upcoming"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 border ${
                      ev.type === "competitive"
                        ? "bg-fgcu-gold/15 text-fgcu-gold border-fgcu-gold/30"
                        : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    {ev.type === "competitive" ? "⚔️ Competitive" : "🎉 Casual"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  📅 {ev.date} · 📍 {ev.location}
                </p>
              </div>
              <Link to="/events" className="text-xs text-cobalt hover:underline shrink-0">
                View →
              </Link>
            </div>
          ))}
          {preview.length === 0 && (
            <p className="text-gray-500 text-sm">No upcoming events right now. Check back soon.</p>
          )}
        </div>
      </section>

      {/* ── Two ways to play ── */}
      <section className="bg-white border-t border-b border-gray-200 py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-cobalt mb-1 text-center">Two ways to play</h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Every event is clearly labelled — so you always know what you're signing up for.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Competitive */}
            <div className="rounded-xl border-2 border-fgcu-gold/40 bg-fgcu-gold/5 p-5">
              <div className="text-2xl mb-2">⚔️</div>
              <h3 className="font-bold text-gray-900 mb-1">Competitive</h3>
              <p className="text-sm text-gray-600">
                Seeded brackets, live ELO tracking, and real prize pools. Register your
                team or solo, show up, and play for something.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-500 list-disc list-inside">
                <li>Double or single elimination brackets</li>
                <li>ELO changes tracked after every match</li>
                <li>Prize pool split among top finishers</li>
                <li>Team lineup shown on event page</li>
              </ul>
            </div>
            {/* Casual */}
            <div className="rounded-xl border-2 border-fgcu-emerald/40 bg-fgcu-emerald/5 p-5">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="font-bold text-gray-900 mb-1">Casual</h3>
              <p className="text-sm text-gray-600">
                Drop in, grab a controller, and play. No brackets, no ELO impact, no
                pressure — perfect for first-timers or a chill Friday night.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-500 list-disc list-inside">
                <li>Free-for-all or pick-up formats</li>
                <li>No ELO tracking</li>
                <li>Walk-in friendly, no pre-registration required</li>
                <li>Open to all skill levels</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Discord CTA ── */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-indigo-900 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">We live in Discord too</h3>
            <p className="text-indigo-200 text-sm max-w-md">
              This platform handles brackets, registration, and ELO stats. For team chat,
              voice comms, match callouts, and daily announcements — that's all on
              Discord. The two work together, not against each other.
            </p>
          </div>
          <a
            href="https://discord.gg/fgcu-esports"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            🎮 Join Discord →
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-400">
        FGCU Esports · Florida Gulf Coast University · Built with React, Vite &amp; Tailwind CSS
      </footer>
    </div>
  );
}
