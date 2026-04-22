import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import fgcuLogo from "../assets/fgcu-logo-250h.jpg";

const navItems = [
  { to: "/dashboard", label: "🎮 Player Dashboard" },
  { to: "/events", label: "📅 Events" },
  { to: "/bracket", label: "🏆 Tournament Bracket" },
  { to: "/sponsor", label: "📊 Sponsor Analytics" },
  { to: "/admin", label: "⚙️ Admin Panel" },
];

// ESPORT-22 / ESPORT-24: mobile-responsive layout with collapsible sidebar
export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-softgray text-gray-900">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — cobalt brand color */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-30 w-56 bg-cobalt flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="px-5 py-6 flex items-center justify-between">
          <div className="bg-white rounded-md px-2 py-1">
            <img src={fgcuLogo} alt="FGCU" className="h-8 w-auto" />
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-white/50 hover:text-white text-xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-fgcu-emerald text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          {/* ESPORT-26: system availability indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-xs text-white/50">
              All systems operational
            </span>
          </div>
          <button
            onClick={() => {
              closeSidebar();
              navigate("/");
            }}
            className="w-full text-sm text-white/50 hover:text-red-300 transition-colors text-left"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar — cobalt */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-cobalt border-b border-white/10 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white text-xl leading-none"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="bg-white rounded-md px-2 py-0.5">
            <img src={fgcuLogo} alt="FGCU" className="h-7 w-auto" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
