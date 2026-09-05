import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

type SummaryStatus = "draft" | "published";
type HomeworkStatus = "none" | "draft" | "published";

interface ClassSummary {
  id: number;
  class: string;
  date: string;
  summaryText: string;
  photoCount: number;
  videoCount: number;
  summaryStatus: SummaryStatus;
  homework: {
    status: HomeworkStatus;
    dueDate?: string;
    itemCount?: number;
    submissions?: number;
    total?: number;
  };
}

const summaries: ClassSummary[] = [
  {
    id: 1, class: "Level 1 – Blue", date: "2026-09-05",
    summaryText: "We practiced family vocabulary and did a great show-and-tell. Most students could name all family members by the end. Emma and Ryan were stars today!",
    photoCount: 4, videoCount: 1, summaryStatus: "published",
    homework: { status: "published", dueDate: "2026-09-12", itemCount: 3, submissions: 8, total: 14 },
  },
  {
    id: 2, class: "Level 1 – Red", date: "2026-09-04",
    summaryText: "ABC song — we sang it three times and practiced writing the letters on mini whiteboards. Big improvement from last week.",
    photoCount: 2, videoCount: 0, summaryStatus: "published",
    homework: { status: "published", dueDate: "2026-09-10", itemCount: 2, submissions: 12, total: 15 },
  },
  {
    id: 3, class: "Level 2 – Green", date: "2026-09-03",
    summaryText: "Colors and shapes vocabulary. Flash cards + matching game. All students completed the matching activity.",
    photoCount: 0, videoCount: 2, summaryStatus: "published",
    homework: { status: "draft", dueDate: "2026-09-10", itemCount: 4 },
  },
  {
    id: 4, class: "Level 1 – Blue", date: "2026-08-29",
    summaryText: "Greetings revision — Hello, Good morning, How are you? Role-play in pairs. Students loved it.",
    photoCount: 3, videoCount: 0, summaryStatus: "published",
    homework: { status: "published", dueDate: "2026-09-05", itemCount: 2, submissions: 14, total: 14 },
  },
  {
    id: 5, class: "Level 1 – Red", date: "2026-08-28",
    summaryText: "",
    photoCount: 0, videoCount: 0, summaryStatus: "draft",
    homework: { status: "none" },
  },
  {
    id: 6, class: "Level 2 – Green", date: "2026-08-27",
    summaryText: "Reading aloud: numbers 1–20. Individual turn-taking. Good confidence building session.",
    photoCount: 1, videoCount: 1, summaryStatus: "published",
    homework: { status: "published", dueDate: "2026-08-27", itemCount: 1, submissions: 13, total: 13 },
  },
];

const classColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Level 1 – Red":   { bg: "bg-[#FF6B47]/10", text: "text-[#FF6B47]", dot: "bg-[#FF6B47]" },
  "Level 1 – Blue":  { bg: "bg-[#6C47FF]/10", text: "text-[#6C47FF]", dot: "bg-[#6C47FF]" },
  "Level 2 – Green": { bg: "bg-[#47D6B5]/10", text: "text-[#47D6B5]", dot: "bg-[#47D6B5]" },
};

function HomeworkBadge({ hw }: { hw: ClassSummary["homework"] }) {
  if (hw.status === "none") return (
    <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">No homework</span>
  );
  if (hw.status === "draft") return (
    <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">📚 HW draft</span>
  );
  const pct = hw.total ? Math.round((hw.submissions! / hw.total) * 100) : 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">📚 HW live</span>
      <span className="text-[10px] text-gray-500 font-semibold">{hw.submissions}/{hw.total} submitted ({pct}%)</span>
    </div>
  );
}

export default function AssignmentList({ onNavigate }: Props) {
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  const allClasses = ["All Classes", "Level 1 – Red", "Level 1 – Blue", "Level 2 – Green"];

  const filtered = summaries.filter((s) => {
    const matchClass = filterClass === "All Classes" || s.class === filterClass;
    const matchStatus = filterStatus === "all" || s.summaryStatus === filterStatus;
    return matchClass && matchStatus;
  });

  const formatDate = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Class Summaries</h1>
          <p className="text-gray-500 text-sm mt-1">
            {summaries.length} sessions · {summaries.filter(s => s.summaryStatus === "draft").length} drafts
          </p>
        </div>
        <button
          onClick={() => onNavigate("create-assignment")}
          className="flex items-center gap-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-200 self-start"
        >
          + New Class Summary
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Class filter */}
        <div className="flex bg-white border border-[#E5E0F5] rounded-xl p-1 gap-1 flex-wrap">
          {allClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterClass === cls ? "bg-[#6C47FF] text-white" : "text-gray-500 hover:text-[#1A1033]"
              }`}
            >
              {cls === "All Classes" ? cls : cls.replace("Level ", "L")}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex bg-white border border-[#E5E0F5] rounded-xl p-1 gap-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterStatus === f ? "bg-[#6C47FF] text-white" : "text-gray-500 hover:text-[#1A1033]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((s) => {
          const cls = classColors[s.class] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
          const isDraft = s.summaryStatus === "draft";
          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border-2 p-4 sm:p-5 hover:shadow-md transition-all group ${
                isDraft ? "border-dashed border-gray-200" : "border-[#E5E0F5] hover:border-[#6C47FF]/30"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Date column */}
                <div className={`w-14 flex-none rounded-xl ${cls.bg} p-2 text-center`}>
                  <div className="text-[10px] font-black uppercase text-gray-400">
                    {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  <div className={`text-2xl font-black leading-none ${cls.text}`} style={{ fontFamily: "Nunito, sans-serif" }}>
                    {new Date(s.date + "T12:00:00").getDate()}
                  </div>
                  <div className="text-[9px] text-gray-400 font-semibold">
                    {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${cls.bg} ${cls.text}`}>{s.class}</span>
                    {isDraft ? (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Draft</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span>
                    )}
                    <HomeworkBadge hw={s.homework} />
                  </div>

                  {s.summaryText ? (
                    <p className="text-sm text-gray-600 leading-snug line-clamp-2">{s.summaryText}</p>
                  ) : (
                    <p className="text-sm text-gray-300 italic">No summary text yet.</p>
                  )}

                  {/* Media + homework indicators */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {s.photoCount > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">🖼️ {s.photoCount} photo{s.photoCount !== 1 ? "s" : ""}</span>
                    )}
                    {s.videoCount > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">🎬 {s.videoCount} video{s.videoCount !== 1 ? "s" : ""}</span>
                    )}
                    {s.homework.status !== "none" && s.homework.dueDate && (
                      <span className="text-xs text-gray-400">📅 HW due {formatDate(s.homework.dueDate)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 flex-none">
                  {s.homework.status === "published" && (
                    <button
                      onClick={() => onNavigate("pending-queue")}
                      className="text-xs font-bold bg-[#F0EBFF] text-[#6C47FF] px-2.5 py-1.5 rounded-lg hover:bg-[#6C47FF] hover:text-white transition-colors"
                    >
                      Queue
                    </button>
                  )}
                  {s.homework.status === "none" && s.summaryStatus === "published" && (
                    <button
                      onClick={() => onNavigate("create-assignment")}
                      className="text-xs font-bold bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      + Homework
                    </button>
                  )}
                  <button className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold">No class summaries found</div>
          <div className="text-sm mt-1">Create your first class summary to get started.</div>
        </div>
      )}
    </div>
  );
}
