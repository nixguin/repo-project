import { useState, Fragment } from "react";
import Layout from "../components/Layout";
import { events, type GameEvent } from "../data/mockData";

type Filter =
  | "all"
  | "upcoming"
  | "live"
  | "completed"
  | "competitive"
  | "casual";

const statusStyle: Record<GameEvent["status"], string> = {
  upcoming: "bg-cobalt/10 text-cobalt",
  live: "bg-yellow-100 text-yellow-700 animate-pulse",
  completed: "bg-gray-100 text-gray-500",
};

const statusLabel: Record<GameEvent["status"], string> = {
  upcoming: "Upcoming",
  live: "🔴 Live",
  completed: "Completed",
};

// ESPORT-39: visual distinction between casual and competitive
const typeStyle: Record<GameEvent["type"], string> = {
  competitive: "bg-fgcu-gold/15 text-fgcu-gold border border-fgcu-gold/30",
  casual: "bg-green-100 text-green-700 border border-green-200",
};
const typeLabel: Record<GameEvent["type"], string> = {
  competitive: "⚔️ Competitive",
  casual: "🎉 Casual",
};

const gameIcons: Record<string, string> = {
  Valorant: "🎯",
  "Rocket League": "🚀",
  "Super Smash Bros. Ultimate": "🕹️",
  "League of Legends": "⚔️",
  "Overwatch 2": "🛡️",
  "Mario Kart 8 Deluxe": "🏎️",
};

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [eventList, setEventList] = useState<GameEvent[]>(events);

  // ESPORT-42: next upcoming event for hero banner
  const nextEvent = eventList.find((e) => e.status === "upcoming");
  const liveEvent = eventList.find((e) => e.status === "live");

  const sortOrder: Record<GameEvent["status"], number> = { live: 0, upcoming: 1, completed: 2 };
  const filtered = eventList
    .filter((e) => {
      if (filter === "all") return true;
      if (filter === "competitive" || filter === "casual")
        return e.type === filter;
      return e.status === filter;
    })
    .sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

  const handleRegister = (id: string) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setEventList((list) =>
          list.map((e) =>
            e.id === id
              ? { ...e, registeredPlayers: e.registeredPlayers - 1 }
              : e,
          ),
        );
      } else {
        next.add(id);
        setEventList((list) =>
          list.map((e) =>
            e.id === id
              ? { ...e, registeredPlayers: e.registeredPlayers + 1 }
              : e,
          ),
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
    competitive: eventList.filter((e) => e.type === "competitive").length,
    casual: eventList.filter((e) => e.type === "casual").length,
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-cobalt mb-3 sm:mb-5">Events</h1>

      {/* â”€â”€ ESPORT-42: Prominent upcoming event hero â”€â”€ */}
      {(liveEvent ?? nextEvent) &&
        (() => {
          const hero = liveEvent ?? nextEvent!;
          const isLive = hero.status === "live";
          return (
            <div
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 border ${
                isLive
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-cobalt/5 border-cobalt/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isLive
                          ? "bg-yellow-100 text-yellow-700 animate-pulse"
                          : "bg-cobalt/10 text-cobalt"
                      }`}
                    >
                      {isLive ? "🔴 HAPPENING NOW" : "⏰ UP NEXT"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeStyle[hero.type]}`}
                    >
                      {typeLabel[hero.type]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-cobalt mb-1">
                    {gameIcons[hero.game] ?? "🎮"} {hero.name}
                  </h2>
                  {/* ESPORT-43: essential details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                    <span>📅 {hero.date}</span>
                    <span>📍 {hero.location}</span>
                    <span>📋 {hero.format}</span>
                    <span>🏆 {hero.prizePool}</span>
                  </div>
                </div>
                {hero.status !== "completed" && (
                  <button
                    onClick={() =>
                      registeredIds.has(hero.id) ||
                      hero.registeredPlayers < hero.maxPlayers
                        ? handleRegister(hero.id)
                        : undefined
                    }
                    className={`shrink-0 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      registeredIds.has(hero.id)
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : hero.registeredPlayers >= hero.maxPlayers
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : isLive
                            ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                            : "bg-fgcu-emerald hover:bg-fgcu-emerald-hover text-white"
                    }`}
                  >
                    {registeredIds.has(hero.id)
                      ? "✓ Registered"
                      : hero.registeredPlayers >= hero.maxPlayers
                        ? "Full"
                        : "Register Now"}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

      {/* â”€â”€ ESPORT-39: Filter tabs including casual / competitive â”€â”€ */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {(
          [
            "all",
            "upcoming",
            "live",
            "completed",
            "competitive",
            "casual",
          ] as Filter[]
        ).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === f
                ? f === "competitive"
                  ? "bg-fgcu-gold text-white"
                  : f === "casual"
                    ? "bg-fgcu-emerald text-white"
                    : "bg-cobalt text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-cobalt/40 hover:text-cobalt"
            }`}
          >
            {f === "competitive"
              ? "⚔️ Competitive"
              : f === "casual"
                ? "🎉 Casual"
                : f}{" "}
            <span className="opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No events found.</p>
        )}
        {filtered.map((ev, idx) => {
          const isRegistered = registeredIds.has(ev.id);
          const isFull = ev.registeredPlayers >= ev.maxPlayers;
          const canRegister = ev.status === "upcoming" && !isFull;
          const fillPct = Math.min(
            100,
            Math.round((ev.registeredPlayers / ev.maxPlayers) * 100),
          );
          const isExpanded = expandedId === ev.id;

          // Section divider: show "Past Events" heading before first completed event
          const showPastDivider =
            ev.status === "completed" &&
            (idx === 0 || filtered[idx - 1].status !== "completed");

          return (
            <Fragment key={ev.id}>
              {showPastDivider && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Past Events</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              )}
              <div
                key={ev.id}
                className={`bg-white border rounded-xl transition-all ${
                  ev.status === "live" ? "border-yellow-400" : "border-gray-200"
                }`}
              >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">
                        {gameIcons[ev.game] ?? "🎮"}
                      </span>
                      <h2 className="text-gray-900 font-semibold text-base truncate">
                        {ev.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusStyle[ev.status]}`}
                      >
                        {statusLabel[ev.status]}
                      </span>
                      {/* ESPORT-39: type badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${typeStyle[ev.type]}`}
                      >
                        {typeLabel[ev.type]}
                      </span>
                    </div>
                    {/* ESPORT-43: essential event details */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>📅 {ev.date}</span>
                      <span>📍 {ev.location}</span>
                      <span>🏆 {ev.prizePool}</span>
                      <span>📋 {ev.format}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                      className="text-xs text-gray-500 hover:text-cobalt px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? "Less ▲" : "Details ▼"}
                    </button>
                    {ev.status !== "completed" && (
                      <button
                        onClick={() =>
                          canRegister || isRegistered
                            ? handleRegister(ev.id)
                            : undefined
                        }
                        disabled={!canRegister && !isRegistered}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                          isRegistered
                            ? "bg-green-100 text-green-700 border border-green-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            : canRegister
                              ? "bg-fgcu-emerald hover:bg-fgcu-emerald-hover text-white"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                      <span className="text-xs text-gray-400 px-3 py-1.5">
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
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        fillPct >= 100
                          ? "bg-red-500"
                          : fillPct >= 75
                            ? "bg-yellow-500"
                            : "bg-fgcu-emerald"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  {ev.status === "upcoming" && (
                    <p className="text-xs text-gray-400 mt-1">
                      Registration closes: {ev.registrationDeadline}
                    </p>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-gray-200 px-5 py-4">
                  <p className="text-sm text-gray-600 mb-3">{ev.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Format", value: ev.format },
                      { label: "Prize Pool", value: ev.prizePool },
                      { label: "Location", value: ev.location },
                      { label: "Date & Time", value: ev.date },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <p className="text-xs text-gray-400 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* ESPORT-45: player lineup for competitive events */}
                  {ev.type === "competitive" && ev.lineup && ev.lineup.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                        Registered Teams / Players
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ev.lineup.map((entry) => (
                          <span
                            key={entry}
                            className="text-xs bg-cobalt/10 text-cobalt px-2.5 py-1 rounded-full font-medium"
                          >
                            {entry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            </Fragment>
          );
        })}
      </div>
    </Layout>
  );
}
