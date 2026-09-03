import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

const submissions = [
  { id: 1, student: "Lily Wang", assignment: "My Family Introduction", class: "Level 1 – Red", submitted: "Aug 30, 2026 · 9:14 AM", isLate: false, status: "pending" },
  { id: 2, student: "Tom Baker", assignment: "ABC Song Practice", class: "Level 1 – Red", submitted: "Aug 30, 2026 · 8:02 AM", isLate: true, status: "pending" },
  { id: 3, student: "Mia Chen", assignment: "My Family Introduction", class: "Level 1 – Blue", submitted: "Aug 30, 2026 · 6:55 AM", isLate: false, status: "pending" },
  { id: 4, student: "Jack Kim", assignment: "Colors & Shapes", class: "Level 2 – Green", submitted: "Aug 29, 2026 · 7:30 PM", isLate: true, status: "pending" },
  { id: 5, student: "Sophie Liu", assignment: "ABC Song Practice", class: "Level 1 – Blue", submitted: "Aug 29, 2026 · 5:12 PM", isLate: false, status: "pending" },
  { id: 6, student: "Ryan Park", assignment: "Greetings in English", class: "Level 1 – Blue", submitted: "Aug 28, 2026 · 4:00 PM", isLate: false, status: "pending" },
  { id: 7, student: "Emma Davis", assignment: "Greetings in English", class: "Level 1 – Blue", submitted: "Aug 28, 2026 · 3:15 PM", isLate: false, status: "pending" },
];

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("");

const avatarColors = [
  "bg-purple-200 text-purple-700",
  "bg-amber-200 text-amber-700",
  "bg-teal-200 text-teal-700",
  "bg-rose-200 text-rose-700",
  "bg-blue-200 text-blue-700",
];

export default function PendingQueue({ onNavigate }: Props) {
  const [sortBy, setSortBy] = useState<"submitted" | "student" | "assignment">("submitted");
  const [filterClass, setFilterClass] = useState("All Classes");

  const classes = ["All Classes", "Level 1 – Red", "Level 1 – Blue", "Level 2 – Green"];

  const filtered = submissions.filter((s) =>
    filterClass === "All Classes" || s.class === filterClass
  );

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Pending Queue</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} submission{filtered.length !== 1 ? "s" : ""} waiting for feedback · Sorted by oldest first
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-white border border-[#E5E0F5] rounded-xl p-1 gap-1">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterClass === cls ? "bg-[#6C47FF] text-white" : "text-gray-500 hover:text-[#1A1033]"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
          Sort:
          {(["submitted", "student", "assignment"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`capitalize font-semibold transition-colors ${
                sortBy === s ? "text-[#6C47FF]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Queue — card on mobile, table on sm+ */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
        {/* Desktop header row */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-x-4 px-5 py-3 border-b border-[#E5E0F5] text-xs font-black text-gray-400 uppercase tracking-wide">
          <div />
          <div>Student</div>
          <div>Assignment</div>
          <div>Submitted</div>
          <div>Status</div>
          <div />
        </div>
        <div className="divide-y divide-[#F0EBFF]">
          {filtered.map((s, i) => (
            <div key={s.id}>
              {/* Mobile card row */}
              <div className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-purple-50/40 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-none ${avatarColors[i % avatarColors.length]}`}>
                  {initials(s.student)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#1A1033]">{s.student}</div>
                  <div className="text-xs text-gray-400 truncate">{s.assignment}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {s.isLate
                      ? <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">⏰ Late</span>
                      : <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✅ On time</span>
                    }
                    <span className="text-[10px] text-gray-400">{s.submitted.split("·")[0].trim()}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate("review-submission")}
                  className="text-xs font-bold bg-[#6C47FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#5535e0] transition-colors flex-none"
                >
                  Review →
                </button>
              </div>
              {/* Desktop table row */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-x-4 items-center px-5 py-3.5 hover:bg-purple-50/40 transition-colors group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${avatarColors[i % avatarColors.length]}`}>
                  {initials(s.student)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1A1033]">{s.student}</div>
                  <div className="text-xs text-gray-400">{s.class}</div>
                </div>
                <div className="text-sm text-gray-600 truncate">{s.assignment}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{s.submitted}</div>
                <div>
                  {s.isLate ? (
                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⏰ Late</span>
                  ) : (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ On time</span>
                  )}
                </div>
                <button
                  onClick={() => onNavigate("review-submission")}
                  className="text-xs font-bold bg-[#6C47FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#5535e0] transition-colors opacity-80 group-hover:opacity-100"
                >
                  Review →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-black text-[#1A1033] text-xl" style={{ fontFamily: "Nunito, sans-serif" }}>All caught up!</div>
          <div className="text-gray-400 text-sm mt-1">No pending submissions for this class.</div>
        </div>
      )}
    </div>
  );
}
