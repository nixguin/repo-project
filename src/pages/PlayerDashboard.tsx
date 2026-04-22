import { useState } from "react";
import {
  currentPlayer,
  recentMatches,
  upcomingMatches,
} from "../data/mockData";
import Layout from "../components/Layout";
import DisputeModal from "../components/DisputeModal";

export default function PlayerDashboard() {
  const [finding, setFinding] = useState(false);
  const [found, setFound] = useState(false);
  const [disputeMatch, setDisputeMatch] = useState<string | null>(null);

  const handleFindMatch = () => {
    setFinding(true);
    setFound(false);
    setTimeout(() => {
      setFinding(false);
      setFound(true);
    }, 2000);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-cobalt mb-6">Player Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "ELO Rating", value: currentPlayer.elo, color: "text-cobalt" },
          { label: "Wins", value: currentPlayer.wins, color: "text-fgcu-emerald" },
          { label: "Losses", value: currentPlayer.losses, color: "text-red-500" },
          { label: "Win Rate", value: `${currentPlayer.winRate}%`, color: "text-yellow-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Match History — US-07 */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Recent Match History
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-200">
                <th className="text-left py-2">Opponent</th>
                <th className="text-left py-2">Map</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">ELO</th>
                <th className="text-left py-2">Result</th>
                <th className="text-left py-2"></th>
              </tr>
            </thead>
            <tbody>
              {recentMatches.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-2.5 text-white font-medium">
                    {m.opponent}
                  </td>
                  <td className="py-2.5 text-gray-400">{m.map}</td>
                  <td className="py-2.5 text-gray-400">{m.date}</td>
                  <td
                    className={`py-2.5 font-semibold ${m.eloChange > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {m.eloChange > 0 ? `+${m.eloChange}` : m.eloChange}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.result === "Win"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {m.result}
                    </span>
                  </td>
                  <td className="py-2.5">
                    {m.result === "Loss" && (
                      <button
                        onClick={() => setDisputeMatch(m.id)}
                        className="text-xs text-yellow-600 hover:text-yellow-500 underline"
                      >
                        Dispute
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI Matchmaking — US-02 / REQ-02 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              AI Matchmaking
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Matches within ELO ±150 and &lt;80ms ping (REQ-02)
            </p>
            {found ? (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700">
                ✓ Match found! <span className="font-bold">GhostTide</span> —
                Lobby link sent.
              </div>
            ) : (
              <button
                onClick={handleFindMatch}
                disabled={finding}
                className="w-full bg-fgcu-emerald hover:bg-fgcu-emerald-hover disabled:opacity-60 transition-colors text-white font-semibold py-3 rounded-lg text-sm"
              >
                {finding ? "Searching…" : "Find Match"}
              </button>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Upcoming Matches
            </h2>
            <div className="space-y-3">
              {upcomingMatches.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="text-gray-900 font-medium">vs {m.opponent}</p>
                    <p className="text-gray-500 text-xs">{m.game}</p>
                  </div>
                  <span className="text-gray-500 text-xs text-right">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Player profile badge */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Signed in as</p>
            <p className="text-gray-900 font-semibold">{currentPlayer.username}</p>
            <p className="text-fgcu-emerald text-xs">
              {currentPlayer.game} · ELO {currentPlayer.elo}
            </p>
          </div>
        </div>
      </div>

      {/* Dispute Modal — US-09 / REQ-07 */}
      {disputeMatch && (
        <DisputeModal
          matchId={disputeMatch}
          onClose={() => setDisputeMatch(null)}
        />
      )}
    </Layout>
  );
}
