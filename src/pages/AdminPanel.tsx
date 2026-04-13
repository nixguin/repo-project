import { useState } from "react";
import Layout from "../components/Layout";
import { adminUsers, type AdminUser } from "../data/mockData";

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
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);

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
      <h1 className="text-2xl font-bold text-white mb-6">
        Admin User Management
      </h1>

      {/* Search — UC-07 */}
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
    </Layout>
  );
}
