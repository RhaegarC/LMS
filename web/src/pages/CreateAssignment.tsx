import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

type ContentType = "text" | "image" | "video";
type ExplainType = "text" | "voice";

interface Explanation {
  type: ExplainType;
  content: string;
}

interface HomeworkItem {
  id: number;
  contentType: ContentType;
  content: string;
  explanation?: Explanation;
}

interface MediaFile {
  id: number;
  name: string;
  type: "photo" | "video";
}

const classes = ["Level 1 – Red", "Level 1 – Blue", "Level 2 – Green"];

const todayISO = () => new Date().toISOString().split("T")[0];
const plusDays = (dateISO: string, n: number) => {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const contentIcon: Record<ContentType, string> = { text: "📝", image: "🖼️", video: "🎬" };
const contentLabel: Record<ContentType, string> = { text: "Text", image: "Image", video: "Video" };

function CollapsibleSection({ title, badge, children, defaultOpen = true }: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>{title}</span>
          {badge && <span className="text-xs font-bold bg-[#F0EBFF] text-[#6C47FF] px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        <span className={`text-gray-400 text-sm transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && <div className="border-t border-[#F0EBFF]">{children}</div>}
    </div>
  );
}

function MediaUploadArea({ type, files, onAdd, onRemove }: {
  type: "photo" | "video";
  files: MediaFile[];
  onAdd: () => void;
  onRemove: (id: number) => void;
}) {
  const isPhoto = type === "photo";
  const accept = isPhoto ? "JPG, PNG" : "MP4, MOV, WEBM";
  const icon = isPhoto ? "🖼️" : "🎬";
  const colors = isPhoto
    ? ["bg-pink-100", "bg-amber-100", "bg-blue-100", "bg-green-100", "bg-purple-100"]
    : ["bg-violet-100", "bg-teal-100", "bg-orange-100"];

  return (
    <div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((f, i) => (
            <div key={f.id} className="relative group">
              <div className={`${isPhoto ? "w-20 h-20" : "w-28 h-20"} rounded-xl ${colors[i % colors.length]} flex flex-col items-center justify-center gap-1`}>
                <span className="text-2xl">{icon}</span>
                <span className="text-[9px] font-semibold text-gray-500 truncate max-w-[68px] px-1">{f.name}</span>
              </div>
              <button
                onClick={() => onRemove(f.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onAdd}
        className="w-full border-2 border-dashed border-[#E5E0F5] rounded-xl p-4 text-center hover:border-[#6C47FF]/40 hover:bg-purple-50/30 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">{icon}</span>
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-400">
            {files.length > 0 ? `Add more ${type}s` : `Upload ${type}s`}
          </div>
          <div className="text-xs text-gray-300">{accept} · max 500 MB</div>
        </div>
      </button>
    </div>
  );
}

export default function CreateAssignment({ onNavigate }: Props) {
  // Identity
  const [selectedClass, setSelectedClass] = useState("");
  const [sessionDate, setSessionDate] = useState(todayISO());

  // Summary section
  const [summaryText, setSummaryText] = useState("");
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const [summaryVideos, setSummaryVideos] = useState<MediaFile[]>([]);

  // Homework section
  const [hasHomework, setHasHomework] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [hwItems, setHwItems] = useState<HomeworkItem[]>([{ id: 1, contentType: "text", content: "" }]);

  // Status
  const [saved, setSaved] = useState<"draft" | "published" | null>(null);
  const [showDueDateWarning, setShowDueDateWarning] = useState(false);

  const addPhoto = () => setPhotos(prev => [...prev, { id: Date.now(), name: `photo-${prev.length + 1}.jpg`, type: "photo" }]);
  const addSummaryVideo = () => setSummaryVideos(prev => [...prev, { id: Date.now(), name: `video-${prev.length + 1}.mp4`, type: "video" }]);
  const removePhoto = (id: number) => setPhotos(prev => prev.filter(f => f.id !== id));
  const removeSummaryVideo = (id: number) => setSummaryVideos(prev => prev.filter(f => f.id !== id));

  const addHwItem = (contentType: ContentType) =>
    setHwItems(prev => [...prev, { id: Date.now(), contentType, content: "" }]);
  const removeHwItem = (id: number) => setHwItems(prev => prev.filter(i => i.id !== id));
  const updateHwContent = (id: number, content: string) =>
    setHwItems(prev => prev.map(i => i.id === id ? { ...i, content } : i));
  const setHwItemType = (id: number, contentType: ContentType) =>
    setHwItems(prev => prev.map(i => i.id === id ? { ...i, contentType, content: "" } : i));
  const setExplanation = (id: number, explanation: Explanation | undefined) =>
    setHwItems(prev => prev.map(i => i.id === id ? { ...i, explanation } : i));
  const updateExplanationContent = (id: number, content: string) =>
    setHwItems(prev => prev.map(i =>
      i.id === id && i.explanation ? { ...i, explanation: { ...i.explanation, content } } : i
    ));

  const toggleHomework = () => {
    if (!hasHomework && sessionDate) {
      setDueDate(plusDays(sessionDate, 7));
    }
    setHasHomework(!hasHomework);
  };

  const handleSave = (publish: boolean) => {
    const bothEmpty = !summaryText && photos.length === 0 && summaryVideos.length === 0 && !hasHomework;
    if (publish && bothEmpty) return;
    setSaved(publish ? "published" : "draft");
    setTimeout(() => onNavigate("assignments"), 1400);
  };

  const dueDateBeforeSession = dueDate && sessionDate && dueDate < sessionDate;

  if (saved) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">{saved === "published" ? "🎉" : "💾"}</div>
        <h2 className="text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          {saved === "published" ? "Class Summary Published!" : "Draft Saved!"}
        </h2>
        <p className="text-gray-500 text-sm">
          {saved === "published" ? "Students can now see the recap." : "You can continue editing later."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("assignments")} className="text-gray-400 hover:text-[#1A1033] transition-colors text-sm">
          ← Back
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>New Class Summary</h1>
          <p className="text-xs text-gray-400 mt-0.5">One per class per day · Recap + optional homework</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* Part 1 — Identity */}
        <div className="bg-white rounded-2xl border border-[#E5E0F5] p-5 sm:p-6">
          <h2 className="font-black text-[#1A1033] mb-4 text-sm uppercase tracking-wide text-[#6C47FF]" style={{ fontFamily: "Nunito, sans-serif" }}>
            Part 1 · Session Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">
                Class <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-[#E5E0F5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors bg-white"
              >
                <option value="">Select a class…</option>
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">
                Session Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full border border-[#E5E0F5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
              />
            </div>
          </div>
          {selectedClass && sessionDate && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#6C47FF] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47D6B5] inline-block" />
              {selectedClass} · {new Date(sessionDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
          )}
        </div>

        {/* Part 2 — Summary (collapsible) */}
        <CollapsibleSection
          title="Part 2 · Summary"
          badge="optional"
        >
          <div className="p-5 sm:p-6 space-y-5">
            {/* Text */}
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-2">📝 Class recap</label>
              <textarea
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                placeholder="What did you cover today? How did the class go? Any notes for parents…"
                rows={4}
                className="w-full text-sm border border-[#E5E0F5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{summaryText.length} chars</div>
            </div>

            {/* Photos */}
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-2">🖼️ Photos from class</label>
              <MediaUploadArea type="photo" files={photos} onAdd={addPhoto} onRemove={removePhoto} />
            </div>

            {/* Videos */}
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-2">🎬 Videos from class</label>
              <MediaUploadArea type="video" files={summaryVideos} onAdd={addSummaryVideo} onRemove={removeSummaryVideo} />
            </div>
          </div>
        </CollapsibleSection>

        {/* Part 3 — Homework (collapsible) */}
        <CollapsibleSection
          title="Part 3 · Homework"
          badge="optional"
          defaultOpen={false}
        >
          <div className="p-5 sm:p-6">
            {!hasHomework ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-sm text-gray-400 mb-4">No homework for this session yet.<br />You can add it now or publish the summary first and add homework later.</p>
                <button
                  onClick={toggleHomework}
                  className="flex items-center gap-2 bg-[#F0EBFF] hover:bg-[#6C47FF] text-[#6C47FF] hover:text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm mx-auto"
                >
                  + Add homework
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">Homework targets <strong className="text-[#1A1033]">{selectedClass || "the selected class"}</strong> automatically.</p>
                  <button onClick={toggleHomework} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">Remove homework</button>
                </div>

                {/* Due date */}
                <div>
                  <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">
                    Due Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border border-[#E5E0F5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
                  />
                  {dueDateBeforeSession && (
                    <p className="text-xs text-orange-500 mt-1.5">⚠️ Due date is before the class date. Are you sure?</p>
                  )}
                  {dueDate && new Date(dueDate) < new Date() && !dueDateBeforeSession && (
                    <p className="text-xs text-orange-500 mt-1.5">⚠️ This due date is in the past.</p>
                  )}
                </div>

                {/* Items builder */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-[#1A1033]">Homework items</label>
                    <span className="text-xs text-gray-400">{hwItems.length} item{hwItems.length !== 1 ? "s" : ""}</span>
                  </div>

                  <div className="space-y-3 mb-3">
                    {hwItems.map((item, idx) => (
                      <div key={item.id} className="border-2 border-[#E5E0F5] rounded-xl overflow-hidden">
                        {/* Item header row */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAF5] border-b border-[#F0EBFF]">
                          <div className="w-6 h-6 rounded-lg bg-[#F0EBFF] text-[#6C47FF] flex items-center justify-center text-xs font-black flex-none">{idx + 1}</div>

                          {/* Type selector pills */}
                          <div className="flex gap-1 flex-1">
                            {(["text", "image", "video"] as ContentType[]).map((ct) => (
                              <button
                                key={ct}
                                onClick={() => setHwItemType(item.id, ct)}
                                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                                  item.contentType === ct
                                    ? "bg-[#6C47FF] text-white"
                                    : "bg-white border border-[#E5E0F5] text-gray-500 hover:border-[#6C47FF]/40 hover:text-[#6C47FF]"
                                }`}
                              >
                                {contentIcon[ct]} {contentLabel[ct]}
                              </button>
                            ))}
                          </div>

                          {/* Reorder + remove */}
                          <div className="flex gap-1 flex-none">
                            {idx > 0 && <button onClick={() => setHwItems(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a; })} className="text-gray-300 hover:text-gray-500 text-sm px-1">↑</button>}
                            {idx < hwItems.length - 1 && <button onClick={() => setHwItems(prev => { const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a; })} className="text-gray-300 hover:text-gray-500 text-sm px-1">↓</button>}
                            <button onClick={() => removeHwItem(item.id)} className="text-gray-300 hover:text-red-400 text-sm px-1 ml-1 transition-colors">×</button>
                          </div>
                        </div>

                        {/* Content input */}
                        <div className="p-4 space-y-3">
                          {item.contentType === "text" ? (
                            <textarea
                              value={item.content}
                              onChange={(e) => updateHwContent(item.id, e.target.value)}
                              placeholder="Write the question or instruction for students…"
                              rows={3}
                              className="w-full text-sm border border-[#E5E0F5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
                            />
                          ) : item.contentType === "image" ? (
                            <div className="border-2 border-dashed border-[#E5E0F5] rounded-xl p-5 text-center cursor-pointer hover:border-[#6C47FF]/40 hover:bg-purple-50/20 transition-all">
                              <div className="text-2xl mb-1">🖼️</div>
                              <div className="text-xs font-semibold text-gray-400">Click to upload image</div>
                              <div className="text-[10px] text-gray-300 mt-0.5">JPG, PNG · max 500 MB</div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-[#E5E0F5] rounded-xl p-5 text-center cursor-pointer hover:border-[#6C47FF]/40 hover:bg-purple-50/20 transition-all">
                              <div className="text-2xl mb-1">🎬</div>
                              <div className="text-xs font-semibold text-gray-400">Click to upload video</div>
                              <div className="text-[10px] text-gray-300 mt-0.5">MP4, MOV, WEBM · max 500 MB</div>
                            </div>
                          )}

                          {/* Explanation */}
                          {!item.explanation ? (
                            <div className="flex gap-2">
                              <span className="text-xs text-gray-400 self-center">Add explanation:</span>
                              <button
                                onClick={() => setExplanation(item.id, { type: "text", content: "" })}
                                className="text-xs font-bold text-gray-400 hover:text-[#6C47FF] px-2.5 py-1 rounded-lg border border-dashed border-gray-200 hover:border-[#6C47FF]/40 transition-all"
                              >
                                📝 Text
                              </button>
                              <button
                                onClick={() => setExplanation(item.id, { type: "voice", content: "" })}
                                className="text-xs font-bold text-gray-400 hover:text-[#6C47FF] px-2.5 py-1 rounded-lg border border-dashed border-gray-200 hover:border-[#6C47FF]/40 transition-all"
                              >
                                🎙️ Voice
                              </button>
                            </div>
                          ) : (
                            <div className="border border-[#E5E0F5] rounded-xl overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-2 bg-amber-50 border-b border-amber-100">
                                <span className="text-xs font-bold text-amber-700">
                                  {item.explanation.type === "text" ? "📝 Text explanation" : "🎙️ Voice explanation"}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setExplanation(item.id, {
                                      type: item.explanation!.type === "text" ? "voice" : "text",
                                      content: ""
                                    })}
                                    className="text-[10px] text-amber-600 hover:text-amber-800 font-semibold transition-colors"
                                  >
                                    Switch to {item.explanation.type === "text" ? "voice" : "text"}
                                  </button>
                                  <button
                                    onClick={() => setExplanation(item.id, undefined)}
                                    className="text-[10px] text-gray-400 hover:text-red-400 font-semibold transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                              <div className="p-3">
                                {item.explanation.type === "text" ? (
                                  <textarea
                                    value={item.explanation.content}
                                    onChange={(e) => updateExplanationContent(item.id, e.target.value)}
                                    placeholder="Optional explanation for students… (e.g. 'Look at the picture and tell me what you see')"
                                    rows={2}
                                    className="w-full text-xs border border-[#E5E0F5] rounded-lg px-3 py-2 focus:outline-none focus:border-amber-300 resize-none transition-colors"
                                  />
                                ) : (
                                  <div className="flex items-center gap-3 py-1">
                                    <button className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 flex items-center justify-center text-sm transition-colors">
                                      🎙️
                                    </button>
                                    <div className="flex-1">
                                      <div className="text-xs font-semibold text-gray-500">Record voice explanation</div>
                                      <div className="text-[10px] text-gray-400">Students hear your voice alongside the item</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => addHwItem("text")} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all">📝 Add Text item</button>
                    <button onClick={() => addHwItem("image")} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all">🖼️ Add Image item</button>
                    <button onClick={() => addHwItem("video")} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all">🎬 Add Video item</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Visibility info */}
        <div className="bg-[#F0EBFF] rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">ℹ️</span>
          <div className="text-xs text-[#6C47FF] leading-relaxed">
            <strong>Draft</strong> — invisible to students. Publish the summary to share the recap; homework stays draft until you publish it separately.
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => onNavigate("assignments")}
            className="px-5 py-2.5 rounded-xl border border-[#E5E0F5] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-600 transition-colors"
          >
            💾 Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={!selectedClass || !sessionDate}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
              selectedClass && sessionDate
                ? "bg-[#6C47FF] hover:bg-[#5535e0] shadow-purple-200"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            🚀 Publish Class Summary
          </button>
        </div>
      </div>
    </div>
  );
}
