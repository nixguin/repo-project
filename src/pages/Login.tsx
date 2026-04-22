import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fgcuLogo from "../assets/fgcu-logo-250h.jpg";

// ESPORT-13: officer credentials gate
const OFFICER_EMAILS = ["officer@fgcu.edu", "admin@fgcu.edu", "tk@fgcu.edu"];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // REQ-01: validate minimum password policy (CON-03)
    const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!pwRegex.test(form.password)) {
      setError(
        "Password must be 8+ chars with an uppercase, number, and special character.",
      );
      return;
    }
    setError("");
    // ESPORT-13: route officers to admin panel, players to dashboard
    const isOfficer = OFFICER_EMAILS.includes(form.email.toLowerCase().trim());
    navigate(isOfficer ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-cobalt flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={fgcuLogo} alt="FGCU" className="h-16 w-auto mb-2" />
          <p className="text-gray-500 text-sm">
            Sign in to track ELO, register for events, and manage your team.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-cobalt text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-fgcu-emerald"
                placeholder="YourGamertag"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-fgcu-emerald"
              placeholder="you@fgcu.edu"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-fgcu-emerald"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-fgcu-emerald hover:bg-fgcu-emerald-hover transition-colors text-white font-semibold py-2.5 rounded-lg text-sm"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* OAuth — REQ-01 */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-800 hover:bg-indigo-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
            >
              <span>🎮</span> Discord
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
            >
              <span>🚂</span> Steam
            </button>
          </div>
        </div>

        {/* ESPORT-13: demo credential hint */}
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">
            Demo credentials
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              <span className="text-gray-400">Player →</span> nova@fgcu.edu
            </p>
            <p>
              <span className="text-gray-400">Officer →</span> tk@fgcu.edu
            </p>
            <p className="text-gray-400 mt-1">
              Password: <span className="font-mono">Test1@abc</span>
            </p>
          </div>
        </div>

        {/* ESPORT-44: built on zero-cost tools */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["React", "Vite", "Tailwind CSS", "GitHub Pages"].map((tool) => (
            <span
              key={tool}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200"
            >
              {tool}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          100% free & open-source stack (ESPORT-44)
        </p>        {/* Guest browse link */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Just browsing?{" "}
          <a href="/events" className="text-fgcu-emerald hover:underline font-medium">
            View events without signing in →
          </a>
        </p>      </div>
    </div>
  );
}
