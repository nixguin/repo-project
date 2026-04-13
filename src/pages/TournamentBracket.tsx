import Layout from "../components/Layout";
import {
  winnersRound1,
  winnersRound2,
  grandFinal,
  losersRound1,
  losersRound2,
  type MatchNode,
} from "../data/mockData";
import { useState } from "react";

function MatchCard({
  match,
  onReport,
}: {
  match: MatchNode;
  onReport?: () => void;
}) {
  const statusColors: Record<MatchNode["status"], string> = {
    done: "border-gray-700",
    live: "border-yellow-500 shadow-yellow-500/20 shadow-md",
    upcoming: "border-gray-700",
  };
  const statusBadge: Record<MatchNode["status"], string> = {
    done: "bg-gray-800 text-gray-400",
    live: "bg-yellow-500/20 text-yellow-400 animate-pulse",
    upcoming: "bg-blue-900/30 text-blue-400",
  };

  return (
    <div
      className={`bg-gray-900 border rounded-xl p-3 w-44 ${statusColors[match.status]}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[match.status]}`}
        >
          {match.status === "live"
            ? "🔴 LIVE"
            : match.status === "done"
              ? "Done"
              : "Upcoming"}
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          {
            name: match.team1,
            score: match.score1,
            isWinner: match.winner === match.team1,
          },
          {
            name: match.team2,
            score: match.score2,
            isWinner: match.winner === match.team2,
          },
        ].map((team, i) => (
          <div
            key={i}
            className={`flex justify-between items-center px-2 py-1 rounded ${team.isWinner ? "bg-purple-900/40" : ""}`}
          >
            <span
              className={`text-xs font-medium truncate ${team.isWinner ? "text-purple-300" : "text-gray-300"}`}
            >
              {team.isWinner && "👑 "}
              {team.name}
            </span>
            {match.status !== "upcoming" && (
              <span
                className={`text-xs font-bold ml-1 ${team.isWinner ? "text-purple-300" : "text-gray-500"}`}
              >
                {team.score ?? "–"}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-2 truncate">{match.time}</p>
      {(match.status === "done" || match.status === "live") && onReport && (
        <button
          onClick={onReport}
          className="mt-2 w-full text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded"
        >
          Report Result
        </button>
      )}
    </div>
  );
}

function RoundColumn({
  title,
  matches,
  onReport,
}: {
  title: string;
  matches: MatchNode[];
  onReport: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </p>
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} onReport={() => onReport(m.id)} />
      ))}
    </div>
  );
}

export default function TournamentBracket() {
  const [reported, setReported] = useState<string | null>(null);

  const handleReport = (id: string) => setReported(id);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Bracket</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            FGCU Spring Invitational — Valorant · Double Elimination
          </p>
        </div>
        <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">
          🔴 In Progress
        </span>
      </div>

      {/* Report confirmation toast */}
      {reported && (
        <div className="mb-4 bg-green-900/30 border border-green-700 rounded-lg px-4 py-2 text-green-400 text-sm flex justify-between">
          <span>
            ✓ Result reported for match <strong>{reported}</strong>. ELO updated
            within 60s (REQ-06).
          </span>
          <button
            onClick={() => setReported(null)}
            className="text-green-600 hover:text-green-400 ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Winners Bracket */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
          Winners Bracket
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-2">
          <RoundColumn
            title="Round 1"
            matches={winnersRound1}
            onReport={handleReport}
          />
          <div className="flex items-center text-gray-700 text-2xl select-none">
            →
          </div>
          <RoundColumn
            title="Round 2"
            matches={winnersRound2}
            onReport={handleReport}
          />
          <div className="flex items-center text-gray-700 text-2xl select-none">
            →
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-1">
              Grand Final
            </p>
            <MatchCard match={grandFinal} />
          </div>
        </div>
      </div>

      {/* Losers Bracket */}
      <div>
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-4">
          Losers Bracket
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-2">
          <RoundColumn
            title="Round 1"
            matches={losersRound1}
            onReport={handleReport}
          />
          <div className="flex items-center text-gray-700 text-2xl select-none">
            →
          </div>
          <RoundColumn
            title="Round 2"
            matches={losersRound2}
            onReport={handleReport}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>{" "}
          Live
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-600 inline-block"></span>{" "}
          Done
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>{" "}
          Upcoming
        </span>
        <span className="flex items-center gap-1">
          <span>👑</span> Winner
        </span>
      </div>
    </Layout>
  );
}
