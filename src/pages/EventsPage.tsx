import { useState } from "react";
import Layout from "../components/Layout";
import { events, type GameEvent } from "../data/mockData";

type Filter = "all" | "upcoming" | "live" | "completed";

const statusStyle: Record<GameEvent["status"], string> = {
  upcoming: "bg-blue-900/40 text-blue-400",
  live: "bg-yellow-500/20 text-yellow-400 animate-pulse",
  completed: "bg-gray-800 text-gray-500",
};

const statusLabel: Record<GameEvent["status"], string> = {
  upcoming: "Upcoming",
  live: "🔴 Live",
  completed: "Completed",
};

const gameIcons: Record<string, string> = {
  Valorant: "🎯",
  "Rocket League": "🚀",
  "Super Smash Bros. Ultimate": "🕹️",
  "League of Legends": "⚔️",
  "Overwatch 2": "🛡️",
};

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [eventList, setEventList] = useState<GameEvent[]>(events);

  const filtered =
    filter === "all" ? eventList : eventList.filter((e) => e.status === filter);

  const handleRegister = (id: string) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setEventList((list) =>
          list.map((e) =>
            e.id === id ? { ...e, registeredPlayers: e.registeredPlayers - 1 } : e
          )
        );
      } else {
        next.add(id);
        setEventList((list) =>
          list.map((e) =>
            e.id === id ? { ...e, registeredPlayers: e.registeredPlayers + 1 } : e
          )
        );
      }
      return next;
    });
  };

  const counts = {
    all: eventList.length,
    upcoming: eventList.filter((e) => e.status === "upcoming").length,
    live: eventList.filter((e) => e.status === "live").length,
    completed: eventList.filter((e) => e.status === "completed").length,
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <span className="text-xs text-gray-500">{counts.upcoming} upcoming · {counts.live} live</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "live", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-purple-700 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {f} <span className="text-xs opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No events found.</p>
        )}
        {filtered.map((ev) => {
          const isRegistered = registeredIds.has(ev.id);
          const isFull = ev.registeredPlayers >= ev.maxPlayers;
          const canRegister = ev.status === "upcoming" && !isFull;
          const fillPct = Math.min(
            100,
            Math.round((ev.registeredPlayers / ev.maxPlayers) * 100)
          );
          const isExpanded = expandedId === ev.id;

          return (
            <div
              key={ev.id}
              className={`bg-gray-900 border rounded-xl transition-all ${
                ev.status === "live"
                  ? "border-yellow-500/50"
                  : "border-gray-800"
              }`}
            >
              {/* Card header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {gameIcons[ev.game] ?? "🎮"}
                      </span>
                      <h2 className="text-white font-semibold text-base truncate">
                        {ev.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusStyle[ev.status]}`}
                      >
                        {statusLabel[ev.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>🎮 {ev.game}</span>
                      <span>📅 {ev.date}</span>
                      <span>🏆 {ev.prizePool}</span>
                      <span>📋 {ev.format}</span>
                      <span>👤 Org: {ev.organizer}</span>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                      className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      {isExpanded ? "Less ▲" : "Details ▼"}
                    </button>
                    {ev.status !== "completed" && (
                      <button
                        onClick={() => canRegister || isRegistered ? handleRegister(ev.id) : undefined}
                        disabled={!canRegister && !isRegistered}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                          isRegistered
                            ? "bg-green-700/30 text-green-400 border border-green-700 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700"
                            : canRegister
                            ? "bg-purple-700 text-white hover:bg-purple-600"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {isRegistered
                          ? "✓ Registered (Withdraw?)"
                          : isFull
                          ? "Full"
                          : "Register"}
                      </button>
                    )}
                    {ev.status === "completed" && (
                      <span className="text-xs text-gray-600 px-3 py-1.5">
                        Event ended
                      </span>
                    )}
                  </div>
                </div>

                {/* Registration bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Registration</span>
                    <span>
                      {ev.registeredPlayers} / {ev.maxPlayers} players
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        fillPct >= 100
                          ? "bg-red-500"
                          : fillPct >= 75
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  {ev.status === "upcoming" && (
                    <p className="text-xs text-gray-600 mt-1">
                      Registration closes: {ev.registrationDeadline}
                    </p>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-gray-800 px-5 py-4">
                  <p className="text-sm text-gray-400">{ev.description}</p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Format", value: ev.format },
                      { label: "Prize Pool", value: ev.prizePool },
                      { label: "Max Players", value: ev.maxPlayers },
                      { label: "Date", value: ev.date },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gray-800/60 rounded-lg p-3"
                      >
                        <p className="text-xs text-gray-500 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm text-white font-medium">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
