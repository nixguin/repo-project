import { useState } from "react";
import Layout from "../components/Layout";
import { adminUsers, events, type AdminUser, type GameEvent } from "../data/mockData";

const roleColors: Record<AdminUser["role"], string> = {
  player: "bg-blue-900/40 text-blue-400",
  organizer: "bg-purple-900/40 text-purple-400",
  sponsor: "bg-yellow-900/40 text-yellow-400",
  admin: "bg-red-900/40 text-red-400",
};

const statusColors: Record<AdminUser["status"], string> = {
  active: "bg-green-900/40 text-green-400",
  banned: "bg-red-900/40 text-red-400",
  pending: "bg-gray-800 text-gray-400",
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);

  // ── Event management state ──────────────────────────────────────────────
  const [eventList, setEventList] = useState<GameEvent[]>(events);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const blankForm = {
    name: "",
    game: "",
    date: "",
    registrationDeadline: "",
    maxPlayers: 16,
    prizePool: "",
    format: "Single Elimination",
    description: "",
    organizer: "TourneyKing",
  };
  const [form, setForm] = useState(blankForm);

  const handleCreateEvent = () => {
    if (!form.name || !form.game || !form.date) return;
    const newEvent: GameEvent = {
      id: `e${Date.now()}`,
      ...form,
      maxPlayers: Number(form.maxPlayers),
      status: "upcoming",
      registeredPlayers: 0,
    };
    setEventList((prev) => [newEvent, ...prev]);
    logAction(`[${new Date().toLocaleTimeString()}] Created event: ${form.name}`);
    setForm(blankForm);
    setShowCreateForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    const ev = eventList.find((e) => e.id === id)!;
    if (ev.status === "live") {
      logAction(`[${new Date().toLocaleTimeString()}] BLOCKED: Cannot delete live event: ${ev.name}`);
      return;
    }
    setEventList((prev) => prev.filter((e) => e.id !== id));
    logAction(`[${new Date().toLocaleTimeString()}] Deleted event: ${ev.name}`);
  };

  const handleToggleEventStatus = (id: string) => {
    setEventList((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next =
          e.status === "upcoming" ? "live" : e.status === "live" ? "completed" : "upcoming";
        logAction(`[${new Date().toLocaleTimeString()}] Event "${e.name}" status → ${next}`);
        return { ...e, status: next };
      })
    );
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const logAction = (msg: string) =>
    setActionLog((prev) => [msg, ...prev].slice(0, 10));

  const handleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "banned" ? "active" : "banned" }
          : u,
      ),
    );
    const u = users.find((u) => u.id === id)!;
    logAction(
      `[${new Date().toLocaleTimeString()}] ${u.status === "banned" ? "Unbanned" : "Banned"} user: ${u.username}`,
    );
  };

  const handlePromote = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u)),
    );
    const u = users.find((u) => u.id === id)!;
    logAction(
      `[${new Date().toLocaleTimeString()}] Promoted ${u.username} to admin`,
    );
  };

  const handleDelete = (id: string) => {
    const u = users.find((u) => u.id === id)!;
    // REQ-UC-07: block delete on active tournament roles
    if (u.role === "organizer") {
      logAction(
        `[${new Date().toLocaleTimeString()}] BLOCKED: Cannot delete organizer ${u.username} with active tournaments`,
      );
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logAction(
      `[${new Date().toLocaleTimeString()}] Deleted user: ${u.username}`,
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["users", "events"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-purple-700 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {tab === "users" ? "👥 User Management" : "📅 Event Management"}
          </button>
        ))}
      </div>

      {/* ── USER MANAGEMENT TAB ─────────────────────────────────────── */}
      {activeTab === "users" && (
        <>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email…"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* User table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-800">
              <th className="text-left px-4 py-3">Username</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">
                  {u.username}
                </td>
                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status]}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBan(u.id)}
                      disabled={u.role === "admin"}
                      className="text-xs px-2 py-1 rounded bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      {u.status === "banned" ? "Unban" : "Ban"}
                    </button>
                    <button
                      onClick={() => handlePromote(u.id)}
                      disabled={u.role === "admin"}
                      className="text-xs px-2 py-1 rounded bg-purple-900/30 hover:bg-purple-900/60 text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={u.role === "admin"}
                      className="text-xs px-2 py-1 rounded bg-red-900/30 hover:bg-red-900/60 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-600">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Log — UC-07: every action is logged */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Action Log (REQ-08)
        </h2>
        {actionLog.length === 0 ? (
          <p className="text-xs text-gray-700">No actions yet.</p>
        ) : (
          <ul className="space-y-1">
            {actionLog.map((entry, i) => (
              <li key={i} className="text-xs text-gray-400 font-mono">
                {entry}
              </li>
            ))}
          </ul>
        )}
      </div>
        </>
      )}

      {/* ── EVENT MANAGEMENT TAB ─────────────────────────────────────── */}
      {activeTab === "events" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{eventList.length} total events</p>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-1.5 text-sm font-semibold bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              {showCreateForm ? "✕ Cancel" : "+ Create Event"}
            </button>
          </div>

          {/* Create Event Form */}
          {showCreateForm && (
            <div className="bg-gray-900 border border-purple-700/50 rounded-xl p-5 mb-5">
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-4">
                New Event
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Event Name", key: "name", type: "text", placeholder: "Spring Valorant Open" },
                  { label: "Game", key: "game", type: "text", placeholder: "Valorant" },
                  { label: "Date & Time", key: "date", type: "text", placeholder: "May 15, 2026 · 3:00 PM" },
                  { label: "Registration Deadline", key: "registrationDeadline", type: "text", placeholder: "May 13, 2026" },
                  { label: "Prize Pool", key: "prizePool", type: "text", placeholder: "$500" },
                  { label: "Max Players", key: "maxPlayers", type: "number", placeholder: "32" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input
                      type={type}
                      value={(form as Record<string, string | number>)[key] as string}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Format</label>
                  <select
                    value={form.format}
                    onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    {["Single Elimination", "Double Elimination", "Round Robin", "Round Robin + Playoffs", "Group Stage + Bracket"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short event description…"
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateEvent}
                disabled={!form.name || !form.game || !form.date}
                className="mt-4 px-5 py-2 text-sm font-semibold bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Create Event
              </button>
            </div>
          )}

          {/* Events table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-gray-800">
                  <th className="text-left px-4 py-3">Event</th>
                  <th className="text-left px-4 py-3">Game</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Players</th>
                  <th className="text-left px-4 py-3">Prize</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventList.map((ev) => (
                  <tr key={ev.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{ev.name}</td>
                    <td className="px-4 py-3 text-gray-400">{ev.game}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{ev.date}</td>
                    <td className="px-4 py-3 text-gray-400">{ev.registeredPlayers}/{ev.maxPlayers}</td>
                    <td className="px-4 py-3 text-yellow-400 font-medium">{ev.prizePool}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ev.status === "live"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : ev.status === "upcoming"
                          ? "bg-blue-900/40 text-blue-400"
                          : "bg-gray-800 text-gray-500"
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleEventStatus(ev.id)}
                          className="text-xs px-2 py-1 rounded bg-purple-900/30 hover:bg-purple-900/60 text-purple-400 transition-colors"
                        >
                          Advance
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          disabled={ev.status === "live"}
                          className="text-xs px-2 py-1 rounded bg-red-900/30 hover:bg-red-900/60 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Log */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Action Log
            </h2>
            {actionLog.length === 0 ? (
              <p className="text-xs text-gray-700">No actions yet.</p>
            ) : (
              <ul className="space-y-1">
                {actionLog.map((entry, i) => (
                  <li key={i} className="text-xs text-gray-400 font-mono">{entry}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

