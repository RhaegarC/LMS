import { useState } from "react";

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${value >= s ? "text-[#FFD147]" : value >= s - 0.5 ? "text-yellow-300" : "text-gray-200"}`}>★</span>
      ))}
      <span className="ml-1 text-xs font-black text-gray-600">{value.toFixed(1)}</span>
    </div>
  );
}

const submissions = [
  { assignment: "Numbers 1–10 Reading", class: "Level 1 – Blue", submitted: "Aug 22, 2026", isLate: false, ratings: [4.5], avg: 4.5, feedback: "Great job! 🌟 Excellent pronunciation!", trend: "up" },
  { assignment: "Greetings in English", class: "Level 1 – Blue", submitted: "Aug 28, 2026", isLate: false, ratings: [4.0, 3.5], avg: 3.75, feedback: "Keep practicing! 💪 Nice effort.", trend: "up" },
  { assignment: "ABC Song Practice", class: "Level 1 – Blue", submitted: "Aug 30, 2026", isLate: false, ratings: [4.5, 4.0], avg: 4.25, feedback: "Wonderful effort! ⭐", trend: "up" },
  { assignment: "My Family Introduction", class: "Level 1 – Blue", submitted: "Sep 1, 2026", isLate: false, ratings: [4.5, 5.0, 3.5], avg: 4.33, feedback: "Fantastic progress! 🚀 I'm so proud!", trend: "up" },
];

const trendIcon = (trend: string) => trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️";
const trendColor = (trend: string) => trend === "up" ? "text-green-500" : trend === "down" ? "text-red-400" : "text-gray-400";

export default function ProgressReport() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const avgScore = submissions.reduce((a, b) => a + b.avg, 0) / submissions.length;
  const onTimeCount = submissions.filter((s) => !s.isLate).length;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Progress Report</h1>
          <p className="text-gray-500 text-sm mt-1">Emma Chen · Level 1 – Blue</p>
        </div>
        <button className="flex items-center gap-2 border border-[#E5E0F5] bg-white text-sm font-bold text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors self-start">
          📄 Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex bg-white border border-[#E5E0F5] rounded-xl p-1 gap-1">
          {[
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "semester", label: "Semester" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeRange(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === t.value ? "bg-[#6C47FF] text-white" : "text-gray-500 hover:text-[#1A1033]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-white border border-[#E5E0F5] rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#6C47FF] text-gray-600"
        >
          <option>All Classes</option>
          <option>Level 1 – Blue</option>
          <option>Level 1 – Red</option>
        </select>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { value: submissions.length.toString(), label: "Assignments", icon: "📋", color: "bg-[#F0EBFF] text-[#6C47FF]" },
          { value: avgScore.toFixed(1) + "⭐", label: "Avg Rating", icon: "⭐", color: "bg-amber-50 text-amber-700" },
          { value: `${onTimeCount}/${submissions.length}`, label: "On Time", icon: "✅", color: "bg-green-50 text-green-700" },
          { value: "📈", label: "Improving!", icon: "", color: "bg-[#47D6B5]/20 text-[#47D6B5]" },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-5 ${stat.color}`}>
            <div className="text-2xl font-black mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>
              {stat.icon ? `${stat.value}` : "📈 Trending up"}
            </div>
            <div className="text-sm font-semibold opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Trendline (simple visual) */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] p-6 mb-6">
        <h2 className="font-black text-[#1A1033] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Performance Trend</h2>
        <div className="flex items-end gap-2 h-24">
          {submissions.map((s, i) => {
            const heightPct = (s.avg / 5) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-400 font-mono">{s.avg.toFixed(1)}</div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#6C47FF] to-[#9B7BFF] transition-all" style={{ height: `${heightPct}%`, minHeight: "8px" }} />
                <div className="text-[10px] text-gray-400 text-center leading-tight">{s.assignment.split(" ").slice(0, 2).join(" ")}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 h-px bg-[#E5E0F5]" />
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>0 ⭐</span>
          <span>5 ⭐</span>
        </div>
      </div>

      {/* Submission history table */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EBFF]">
          <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Submission History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0EBFF] text-xs font-black text-gray-400 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Assignment</th>
                <th className="text-left px-5 py-3">Submitted</th>
                <th className="text-left px-5 py-3">Item Ratings</th>
                <th className="text-left px-5 py-3">Avg</th>
                <th className="text-left px-5 py-3">Feedback</th>
                <th className="text-left px-5 py-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBFF]">
              {submissions.map((s, i) => (
                <tr key={i} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-sm text-[#1A1033]">{s.assignment}</div>
                    <div className="text-xs text-gray-400">{s.class}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm text-gray-600">{s.submitted}</div>
                    {s.isLate && <span className="text-xs font-bold text-orange-500">⏰ Late</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-1">
                      {s.ratings.map((r, ri) => (
                        <div key={ri} className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 font-mono w-4">{ri + 1}.</span>
                          <StarDisplay value={r} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-black text-sm text-[#1A1033]">{s.avg.toFixed(1)}</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <span key={st} className={`text-xs ${s.avg >= st ? "text-[#FFD147]" : "text-gray-200"}`}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-[180px]">
                    <p className="text-xs text-gray-500 truncate">{s.feedback}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold ${trendColor(s.trend)}`}>{trendIcon(s.trend)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
