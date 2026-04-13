import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-purple-400 text-3xl font-extrabold tracking-wider">
            ⚡ FGCU Esports
          </span>
          <p className="text-gray-500 text-sm mt-1">
            AI-Powered Competitive Gaming Platform
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-purple-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="YourGamertag"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              placeholder="you@fgcu.edu"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 transition-colors text-white font-semibold py-2.5 rounded-lg text-sm"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* OAuth — REQ-01 */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-800" />
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
      </div>
    </div>
  );
}
