import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

function StatCard({ value, label, color, icon, sub }: { value: string; label: string; color: string; icon: string; sub?: string }) {
  return (
    <div className={`rounded-2xl p-5 relative overflow-hidden ${color}`}>
      <div className="text-3xl font-black mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>{value}</div>
      <div className="text-sm font-semibold opacity-80">{label}</div>
      {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
      <div className="absolute right-4 top-4 text-2xl opacity-30">{icon}</div>
    </div>
  );
}

function QueueRow({ name, assignment, submitted, isLate, onReview }: {
  name: string; assignment: string; submitted: string; isLate: boolean; onReview: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-purple-50/60 transition-colors group">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-200 to-violet-300 flex items-center justify-center text-sm font-black text-purple-700 flex-none">
        {name.split(" ").map(n => n[0]).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#1A1033] truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{assignment}</div>
      </div>
      <div className="flex items-center gap-2 flex-none">
        {isLate && (
          <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
            ⏰ Late
          </span>
        )}
        <span className="text-xs text-gray-400">{submitted}</span>
      </div>
      <button
        onClick={onReview}
        className="text-xs font-bold bg-[#6C47FF] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#5535e0]"
      >
        Review
      </button>
    </div>
  );
}

export default function TeacherDashboard({ onNavigate }: Props) {
  const queue = [
    { name: "Lily Wang", assignment: "My Family Introduction", submitted: "2h ago", isLate: false },
    { name: "Tom Baker", assignment: "ABC Song Practice", submitted: "3h ago", isLate: true },
    { name: "Mia Chen", assignment: "My Family Introduction", submitted: "5h ago", isLate: false },
    { name: "Jack Kim", assignment: "Colors & Shapes", submitted: "Yesterday", isLate: true },
    { name: "Sophie Liu", assignment: "ABC Song Practice", submitted: "Yesterday", isLate: false },
  ];

  const recentAssignments = [
    { title: "My Family Introduction", classes: "Level 1 – Red, Level 1 – Blue", due: "Sep 5", status: "published", submissions: 18 },
    { title: "ABC Song Practice", classes: "Level 1 – Red", due: "Sep 3", status: "published", submissions: 12 },
    { title: "Colors & Shapes", classes: "Level 2 – Green", due: "Sep 10", status: "draft", submissions: 0 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-sm font-semibold text-[#6C47FF] mb-1">Good morning 👋</div>
          <h1 className="text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
            Ms. Johnson's Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Saturday, Aug 30, 2026 · 3 classes active</p>
        </div>
        <button
          onClick={() => onNavigate("create-assignment")}
          className="flex items-center gap-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-200"
        >
          <span>+</span> New Assignment
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard value="7" label="Pending Review" color="bg-[#FF6B47] text-white" icon="⏳" sub="Oldest: 2 days ago" />
        <StatCard value="3" label="Active Classes" color="bg-[#FFD147] text-[#1A1033]" icon="🏫" sub="42 students total" />
        <StatCard value="12" label="Assignments" color="bg-[#47D6B5] text-white" icon="📋" sub="2 drafts" />
        <StatCard value="94%" label="On-Time Rate" color="bg-[#6C47FF] text-white" icon="✅" sub="This month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pending queue */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E0F5] flex items-center justify-between">
            <div>
              <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Pending Queue</h2>
              <p className="text-xs text-gray-400 mt-0.5">Sorted by oldest first</p>
            </div>
            <button onClick={() => onNavigate("pending-queue")} className="text-xs font-bold text-[#6C47FF] hover:underline">
              View all →
            </button>
          </div>
          <div className="divide-y divide-[#F0EBFF]">
            {queue.map((q, i) => (
              <QueueRow key={i} {...q} onReview={() => onNavigate("review-submission")} />
            ))}
          </div>
        </div>

        {/* Recent assignments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E0F5] flex items-center justify-between">
            <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Assignments</h2>
            <button onClick={() => onNavigate("assignments")} className="text-xs font-bold text-[#6C47FF] hover:underline">
              All →
            </button>
          </div>
          <div className="divide-y divide-[#F0EBFF]">
            {recentAssignments.map((a, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-purple-50/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#1A1033] truncate">{a.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-none ${
                    a.status === "draft"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {a.status === "draft" ? "Draft" : "Live"}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{a.classes}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-400">Due {a.due}</span>
                  {a.submissions > 0 && (
                    <span className="text-xs font-semibold text-[#6C47FF]">{a.submissions} submissions</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3.5">
            <button
              onClick={() => onNavigate("create-assignment")}
              className="w-full border-2 border-dashed border-[#E5E0F5] rounded-xl py-2.5 text-sm font-bold text-gray-400 hover:border-[#6C47FF] hover:text-[#6C47FF] transition-colors"
            >
              + Create assignment
            </button>
          </div>
        </div>
      </div>

      {/* Class quick stats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { name: "Level 1 – Red", students: 15, rate: 92, color: "border-t-[#FF6B47]" },
          { name: "Level 1 – Blue", students: 14, rate: 96, color: "border-t-[#6C47FF]" },
          { name: "Level 2 – Green", students: 13, rate: 88, color: "border-t-[#47D6B5]" },
        ].map((cls, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-[#E5E0F5] border-t-4 ${cls.color} p-5`}>
            <div className="font-black text-[#1A1033] mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>{cls.name}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{cls.students} students</span>
              <span className="font-bold text-[#47D6B5]">{cls.rate}% on time</span>
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-[#47D6B5] rounded-full" style={{ width: `${cls.rate}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
