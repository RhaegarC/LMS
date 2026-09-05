import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

interface ClassSummary {
  id: number;
  date: string;
  class: string;
  recapText: string;
  photoCount: number;
  videoCount: number;
  homework?: {
    dueDate: string;
    daysLeft: number;
    items: number;
    status: "not-started" | "in-progress" | "submitted" | "feedback-ready";
    itemTypes: string[];
  };
}

const summaries: ClassSummary[] = [
  {
    id: 1, date: "2026-09-05", class: "Level 1 – Blue",
    recapText: "We practiced family vocabulary and did a show-and-tell. Most of you knew all the family words by the end — great job!",
    photoCount: 4, videoCount: 1,
    homework: {
      dueDate: "Sep 12", daysLeft: 7, items: 3, status: "not-started",
      itemTypes: ["voice", "text", "video"],
    },
  },
  {
    id: 2, date: "2026-09-04", class: "Level 1 – Blue",
    recapText: "ABC song practice — we sang three times and worked on writing. Big improvement!",
    photoCount: 2, videoCount: 0,
    homework: {
      dueDate: "Sep 10", daysLeft: 4, items: 2, status: "in-progress",
      itemTypes: ["video", "voice"],
    },
  },
  {
    id: 3, date: "2026-08-29", class: "Level 1 – Blue",
    recapText: "Greetings revision — Hello, Good morning, How are you? Fun role-play in pairs.",
    photoCount: 3, videoCount: 0,
    homework: {
      dueDate: "Sep 5", daysLeft: -2, items: 2, status: "submitted",
      itemTypes: ["voice", "text"],
    },
  },
  {
    id: 4, date: "2026-08-20", class: "Level 1 – Blue",
    recapText: "Numbers 1–10 reading aloud. You were so brave doing it one by one!",
    photoCount: 0, videoCount: 1,
    homework: {
      dueDate: "Aug 27", daysLeft: -10, items: 1, status: "feedback-ready",
      itemTypes: ["voice"],
    },
  },
  {
    id: 5, date: "2026-08-15", class: "Level 1 – Blue",
    recapText: "Colors and shapes — we played a matching game with flashcards. Lots of fun!",
    photoCount: 1, videoCount: 0,
  },
];

const hwStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "not-started":    { label: "Not Started",        color: "text-gray-500",   bg: "bg-gray-100" },
  "in-progress":    { label: "In Progress",         color: "text-blue-600",   bg: "bg-blue-100" },
  "submitted":      { label: "Submitted",           color: "text-green-700",  bg: "bg-green-100" },
  "feedback-ready": { label: "Feedback Ready ⭐",   color: "text-purple-700", bg: "bg-purple-100" },
};

const itemIcon = (t: string) => t === "video" ? "🎥" : t === "voice" ? "🎙️" : "📝";

export default function StudentDashboard({ onNavigate }: Props) {
  const pending = summaries.filter(s => s.homework && ["not-started", "in-progress"].includes(s.homework.status));
  const completed = summaries.filter(s => s.homework && ["submitted", "feedback-ready"].includes(s.homework.status));
  const noHw = summaries.filter(s => !s.homework);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-[#47D6B5] mb-1">Welcome back! 🌟</div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          Hi Emma! Ready to learn?
        </h1>
        <p className="text-gray-500 text-sm mt-1">Level 1 – Blue · {pending.length} homework task{pending.length !== 1 ? "s" : ""} to do</p>
      </div>

      {/* Stats card */}
      <div className="mb-6 bg-gradient-to-r from-[#6C47FF] to-[#9B7BFF] rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-2 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-16 bottom-2 w-10 h-10 bg-[#FFD147]/30 rotate-45" />
        <div className="relative z-10 flex items-center gap-3 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>5</div>
            <div className="text-[10px] sm:text-xs text-purple-200">done</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>4.3⭐</div>
            <div className="text-[10px] sm:text-xs text-purple-200">avg rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>92%</div>
            <div className="text-[10px] sm:text-xs text-purple-200">on time</div>
          </div>
          <div className="ml-auto">
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Homework to do */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-black text-[#1A1033] text-xl mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Homework to do 📋</h2>
          <div className="space-y-3">
            {pending.map((s) => {
              const hw = s.homework!;
              const isUrgent = hw.daysLeft <= 2 && hw.daysLeft >= 0;
              const isOverdue = hw.daysLeft < 0;
              return (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl border-2 p-4 sm:p-5 transition-all hover:shadow-md cursor-pointer ${
                    isOverdue ? "border-red-200" : isUrgent ? "border-orange-200" : "border-[#E5E0F5] hover:border-[#6C47FF]/30"
                  }`}
                  onClick={() => onNavigate("submit-assignment")}
                >
                  {/* Class summary link */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#F0EBFF]">
                    <span className="text-xs font-bold bg-[#6C47FF]/10 text-[#6C47FF] px-2 py-0.5 rounded-full">{s.class}</span>
                    <span className="text-xs text-gray-400">
                      Class of {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    {s.photoCount > 0 && <span className="text-xs text-gray-400">🖼️ {s.photoCount}</span>}
                    {s.videoCount > 0 && <span className="text-xs text-gray-400">🎬 {s.videoCount}</span>}
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hwStatusConfig[hw.status].bg} ${hwStatusConfig[hw.status].color}`}>
                          {hwStatusConfig[hw.status].label}
                        </span>
                        {isOverdue && <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⏰ Late</span>}
                      </div>
                      <h3 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
                        Homework — {hw.items} task{hw.items !== 1 ? "s" : ""}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">{hw.itemTypes.map((t, i) => <span key={i} className="text-sm">{itemIcon(t)}</span>)}</div>
                        <span className="text-xs text-gray-400">{s.class}</span>
                      </div>
                    </div>
                    <div className="text-right flex-none">
                      <div className={`text-sm font-black ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-[#1A1033]"}`}>
                        {isOverdue ? `${Math.abs(hw.daysLeft)}d overdue` : hw.daysLeft === 0 ? "Due today!" : `${hw.daysLeft}d left`}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">Due {hw.dueDate}</div>
                      <button className="mt-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                        {hw.status === "in-progress" ? "Continue →" : "Start →"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed homework */}
      {completed.length > 0 && (
        <div className="mb-6">
          <h2 className="font-black text-[#1A1033] text-xl mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Done ✅</h2>
          <div className="space-y-2">
            {completed.map((s) => {
              const hw = s.homework!;
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-[#E5E0F5] p-4 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => onNavigate("view-feedback")}
                >
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-none">
                    {hw.status === "feedback-ready" ? "⭐" : "✅"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-[#1A1033]">
                      Homework · {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="text-xs text-gray-400">{s.class} · Due {hw.dueDate}</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-none ${hwStatusConfig[hw.status].bg} ${hwStatusConfig[hw.status].color}`}>
                    {hwStatusConfig[hw.status].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recap-only summaries (no homework) */}
      {noHw.length > 0 && (
        <div>
          <h2 className="font-black text-[#1A1033] text-xl mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Class recaps 📸</h2>
          <div className="space-y-2">
            {noHw.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-[#E5E0F5] p-4 flex items-center gap-3 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-base flex-none">📸</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#1A1033] truncate">
                    {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{s.recapText || "No recap text."}</div>
                </div>
                <div className="flex gap-2 flex-none text-xs text-gray-400">
                  {s.photoCount > 0 && <span>🖼️ {s.photoCount}</span>}
                  {s.videoCount > 0 && <span>🎬 {s.videoCount}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
