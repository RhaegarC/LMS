import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

const assignments = [
  {
    id: 1, title: "My Family Introduction", classes: ["Level 1 – Red", "Level 1 – Blue"],
    due: "Sep 5, 2026", status: "published", submissions: 18, total: 29, items: 3,
    itemTypes: ["text", "video", "voice"],
  },
  {
    id: 2, title: "ABC Song Practice", classes: ["Level 1 – Red"],
    due: "Sep 3, 2026", status: "published", submissions: 12, total: 15, items: 2,
    itemTypes: ["video", "voice"],
  },
  {
    id: 3, title: "Colors & Shapes Vocabulary", classes: ["Level 2 – Green"],
    due: "Sep 10, 2026", status: "draft", submissions: 0, total: 13, items: 4,
    itemTypes: ["text", "video", "text", "voice"],
  },
  {
    id: 4, title: "Greetings in English", classes: ["Level 1 – Blue"],
    due: "Aug 28, 2026", status: "published", submissions: 14, total: 14, items: 2,
    itemTypes: ["voice", "text"],
  },
  {
    id: 5, title: "My Favorite Animal", classes: ["Level 1 – Red", "Level 2 – Green"],
    due: "Sep 15, 2026", status: "draft", submissions: 0, total: 28, items: 3,
    itemTypes: ["text", "video", "voice"],
  },
  {
    id: 6, title: "Numbers 1–10 Reading", classes: ["Level 1 – Red"],
    due: "Aug 20, 2026", status: "published", submissions: 15, total: 15, items: 1,
    itemTypes: ["voice"],
  },
];

const itemTypeIcon = (t: string) => t === "video" ? "🎥" : t === "voice" ? "🎙️" : "📝";

export default function AssignmentList({ onNavigate }: Props) {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");

  const filtered = assignments.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">{assignments.length} total · {assignments.filter(a => a.status === "draft").length} drafts</p>
        </div>
        <button
          onClick={() => onNavigate("create-assignment")}
          className="flex items-center gap-2 bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-200 self-start"
        >
          + New Assignment
        </button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-white border border-[#E5E0F5] rounded-xl p-1 gap-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f ? "bg-[#6C47FF] text-white" : "text-gray-500 hover:text-[#1A1033]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments…"
            className="w-full bg-white border border-[#E5E0F5] rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
          />
        </div>
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const pct = a.total > 0 ? Math.round((a.submissions / a.total) * 100) : 0;
          const isPast = new Date(a.due) < new Date();
          return (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-[#E5E0F5] p-5 hover:border-[#6C47FF]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      a.status === "draft"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {a.status === "draft" ? "Draft" : "Published"}
                    </span>
                    {isPast && a.status === "published" && (
                      <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Overdue</span>
                    )}
                  </div>
                  <h3 className="font-black text-[#1A1033] text-lg" style={{ fontFamily: "Nunito, sans-serif" }}>{a.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {a.classes.map((cls) => (
                      <span key={cls} className="text-xs bg-[#F0EBFF] text-[#6C47FF] font-semibold px-2 py-0.5 rounded-full">{cls}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-none text-sm">
                  <div className="text-center hidden lg:block">
                    <div className="flex gap-1">
                      {a.itemTypes.slice(0, 4).map((t, i) => (
                        <span key={i} title={t} className="text-base">{itemTypeIcon(t)}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.items} items</div>
                  </div>
                  <div className="text-center hidden lg:block">
                    <div className="font-bold text-[#1A1033]">Due {a.due.split(",")[0]}</div>
                    <div className="text-xs text-gray-400">{a.due.split(", ")[1]}</div>
                  </div>
                  {a.status === "published" && (
                    <div className="text-center">
                      <div className="font-black text-[#1A1033]">{a.submissions}/{a.total}</div>
                      <div className="text-xs text-gray-400">submitted</div>
                      <div className="mt-1 w-16 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-[#47D6B5] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {a.status === "published" && (
                    <button
                      onClick={() => onNavigate("pending-queue")}
                      className="text-xs font-bold bg-[#F0EBFF] text-[#6C47FF] px-3 py-1.5 rounded-lg hover:bg-[#6C47FF] hover:text-white transition-colors"
                    >
                      Queue
                    </button>
                  )}
                  <button className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                  <button className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                    Clone
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
          <div className="font-semibold">No assignments found</div>
        </div>
      )}
    </div>
  );
}
