import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import Layout from "../components/Layout";
import { sponsorCampaign, dailyMetrics } from "../data/mockData";

function exportCSV() {
  const headers = ["Day", "Impressions", "Clicks", "Engagement(%)"];
  const rows = dailyMetrics.map((d) => [
    d.day,
    d.impressions,
    d.clicks,
    d.engagement,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sponsor_campaign_metrics.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SponsorAnalytics() {
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const c = sponsorCampaign;
  const budgetPct = Math.round((c.spent / c.budget) * 100);

  return (
    <Layout>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Sponsor Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">{c.name}</p>
        </div>
        {/* REQ-11: CSV export */}
        <button
          onClick={exportCSV}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm text-gray-300 px-4 py-2 rounded-lg transition-colors"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* KPI Cards — REQ-05 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Impressions",
            value: c.impressions.toLocaleString(),
            color: "text-purple-400",
          },
          { label: "CTR", value: `${c.ctr}%`, color: "text-blue-400" },
          {
            label: "Total Clicks",
            value: c.clicks.toLocaleString(),
            color: "text-green-400",
          },
          {
            label: "Engagement Rate",
            value: `${c.engagement}%`,
            color: "text-yellow-400",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Budget Usage</span>
          <span className="text-sm text-white font-semibold">
            ${c.spent.toLocaleString()} / ${c.budget.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {budgetPct}% spent · {c.reach.toLocaleString()} total reach
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions over time */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Impressions
            </h2>
            <div className="flex gap-1">
              {(["daily", "weekly", "monthly"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2 py-0.5 rounded ${filter === f ? "bg-purple-700 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyMetrics}>
              <defs>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="#7c3aed"
                fill="url(#impGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks + Engagement */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
            Clicks &amp; Engagement
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagement" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
