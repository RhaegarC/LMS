import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

const assignments = [
  {
    id: 1, title: "My Family Introduction", class: "Level 1 – Blue", due: "Sep 5, 2026",
    daysLeft: 6, items: 3, status: "not-started",
    itemTypes: ["voice", "text", "video"],
  },
  {
    id: 2, title: "ABC Song Practice", class: "Level 1 – Blue", due: "Sep 3, 2026",
    daysLeft: 4, items: 2, status: "in-progress",
    itemTypes: ["video", "voice"],
  },
  {
    id: 3, title: "Greetings in English", class: "Level 1 – Blue", due: "Aug 28, 2026",
    daysLeft: -2, items: 2, status: "submitted",
    itemTypes: ["voice", "text"],
  },
  {
    id: 4, title: "Numbers 1–10 Reading", class: "Level 1 – Blue", due: "Aug 20, 2026",
    daysLeft: -10, items: 1, status: "feedback-ready",
    itemTypes: ["voice"],
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "not-started": { label: "Not Started", color: "text-gray-500", bg: "bg-gray-100" },
  "in-progress": { label: "In Progress", color: "text-blue-600", bg: "bg-blue-100" },
  "submitted": { label: "Submitted", color: "text-green-700", bg: "bg-green-100" },
  "feedback-ready": { label: "Feedback Ready ⭐", color: "text-purple-700", bg: "bg-purple-100" },
};

const itemIcon = (t: string) => t === "video" ? "🎥" : t === "voice" ? "🎙️" : "📝";

export default function StudentDashboard({ onNavigate }: Props) {
  const pending = assignments.filter((a) => ["not-started", "in-progress"].includes(a.status));
  const completed = assignments.filter((a) => ["submitted", "feedback-ready"].includes(a.status));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-[#47D6B5] mb-1">Welcome back! 🌟</div>
        <h1 className="text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          Hi Emma! Ready to learn?
        </h1>
        <p className="text-gray-500 text-sm mt-1">Level 1 – Blue · {pending.length} assignment{pending.length !== 1 ? "s" : ""} to do</p>
      </div>

      {/* Fun streak card */}
      <div className="mb-8 bg-gradient-to-r from-[#6C47FF] to-[#9B7BFF] rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Memphis shapes */}
        <div className="absolute right-4 top-2 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-16 bottom-2 w-10 h-10 bg-[#FFD147]/30 rotate-45" />
        <div className="absolute right-8 top-8 w-6 h-6 rounded-full border-2 border-white/20" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>5</div>
            <div className="text-xs text-purple-200">assignments done</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>4.3⭐</div>
            <div className="text-xs text-purple-200">avg rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>92%</div>
            <div className="text-xs text-purple-200">on time</div>
          </div>
          <div className="ml-auto">
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Pending assignments */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-black text-[#1A1033] text-xl mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
            To Do 📋
          </h2>
          <div className="space-y-3">
            {pending.map((a) => {
              const isUrgent = a.daysLeft <= 2 && a.daysLeft >= 0;
              const isOverdue = a.daysLeft < 0;
              return (
                <div
                  key={a.id}
                  className={`bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-md cursor-pointer ${
                    isOverdue ? "border-red-200" : isUrgent ? "border-orange-200" : "border-[#E5E0F5] hover:border-[#6C47FF]/30"
                  }`}
                  onClick={() => onNavigate("submit-assignment")}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusConfig[a.status].bg} ${statusConfig[a.status].color}`}>
                          {statusConfig[a.status].label}
                        </span>
                        {isOverdue && (
                          <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⏰ Late</span>
                        )}
                      </div>
                      <h3 className="font-black text-[#1A1033] text-lg" style={{ fontFamily: "Nunito, sans-serif" }}>{a.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{a.class}</span>
                        <span className="text-gray-200">·</span>
                        <div className="flex gap-1">
                          {a.itemTypes.map((t, i) => (
                            <span key={i} className="text-sm">{itemIcon(t)}</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{a.items} tasks</span>
                      </div>
                    </div>
                    <div className="text-right flex-none">
                      <div className={`text-sm font-black ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-[#1A1033]"}`}>
                        {isOverdue
                          ? `${Math.abs(a.daysLeft)}d overdue`
                          : a.daysLeft === 0
                          ? "Due today!"
                          : `${a.daysLeft} days left`}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">Due {a.due.split(",")[0]}</div>
                      <button className="mt-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                        {a.status === "in-progress" ? "Continue →" : "Start →"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed assignments */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-black text-[#1A1033] text-xl mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
            Done ✅
          </h2>
          <div className="space-y-2">
            {completed.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-[#E5E0F5] p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onNavigate("view-feedback")}
              >
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-none">
                  {a.status === "feedback-ready" ? "⭐" : "✅"}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#1A1033]">{a.title}</div>
                  <div className="text-xs text-gray-400">{a.class} · {a.due}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[a.status].bg} ${statusConfig[a.status].color}`}>
                  {statusConfig[a.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
