import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

type ItemType = "text" | "video" | "voice";

interface Item {
  id: number;
  type: ItemType;
  content: string;
}

export default function CreateAssignment({ onNavigate }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([
    { id: 1, type: "text", content: "" },
  ]);
  const [isDraft, setIsDraft] = useState(true);
  const [saved, setSaved] = useState(false);

  const classes = ["Level 1 – Red", "Level 1 – Blue", "Level 2 – Green"];

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const addItem = (type: ItemType) => {
    setItems((prev) => [...prev, { id: Date.now(), type, content: "" }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateContent = (id: number, content: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, content } : item));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onNavigate("assignments");
    }, 1200);
  };

  const itemIcon = (t: ItemType) => t === "video" ? "🎥" : t === "voice" ? "🎙️" : "📝";
  const itemLabel = (t: ItemType) => t === "video" ? "Video Instruction" : t === "voice" ? "Voice Recording" : "Text Instruction";

  if (saved) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          {isDraft ? "Draft Saved!" : "Assignment Published!"}
        </h2>
        <p className="text-gray-500">Redirecting to assignments…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => onNavigate("assignments")} className="text-gray-400 hover:text-[#1A1033] transition-colors">
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Create Assignment</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-[#E5E0F5] p-6">
          <h2 className="font-black text-[#1A1033] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Assignment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Family Introduction"
                maxLength={100}
                className="w-full border border-[#E5E0F5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">Due Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-[#E5E0F5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
              />
              {dueDate && new Date(dueDate) < new Date() && (
                <p className="text-xs text-orange-500 mt-1.5">⚠️ This due date is in the past. Are you sure?</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1A1033] block mb-1.5">Target Classes <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selectedClasses.includes(cls)
                        ? "bg-[#6C47FF] border-[#6C47FF] text-white"
                        : "border-[#E5E0F5] text-gray-500 hover:border-[#6C47FF]/40"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items builder */}
        <div className="bg-white rounded-2xl border border-[#E5E0F5] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
              Assignment Items
            </h2>
            <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="space-y-3 mb-4">
            {items.map((item, idx) => (
              <div key={item.id} className="border-2 border-[#E5E0F5] rounded-xl p-4 relative group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#F0EBFF] text-[#6C47FF] flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-[#1A1033]">
                    {itemIcon(item.type)} {itemLabel(item.type)}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    {idx > 0 && (
                      <button className="text-gray-300 hover:text-gray-500 text-sm px-1">↑</button>
                    )}
                    {idx < items.length - 1 && (
                      <button className="text-gray-300 hover:text-gray-500 text-sm px-1">↓</button>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 text-sm px-1 ml-1 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {item.type === "text" ? (
                  <textarea
                    value={item.content}
                    onChange={(e) => updateContent(item.id, e.target.value)}
                    placeholder="Write your instruction here… (supports bold, italics, bullet lists)"
                    rows={3}
                    className="w-full text-sm border border-[#E5E0F5] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
                  />
                ) : item.type === "video" ? (
                  <div className="border-2 border-dashed border-[#E5E0F5] rounded-xl p-6 text-center cursor-pointer hover:border-[#6C47FF]/40 transition-colors">
                    <div className="text-2xl mb-1">🎥</div>
                    <div className="text-sm font-semibold text-gray-400">Click to upload video</div>
                    <div className="text-xs text-gray-300 mt-1">MP4, MOV, WEBM · max 500 MB</div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#E5E0F5] rounded-xl p-6 text-center cursor-pointer hover:border-[#6C47FF]/40 transition-colors">
                    <div className="text-2xl mb-1">🎙️</div>
                    <div className="text-sm font-semibold text-gray-400">Click to record or upload audio</div>
                    <div className="text-xs text-gray-300 mt-1">MP3, M4A · max 500 MB</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add item buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => addItem("text")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all"
            >
              📝 Add Text
            </button>
            <button
              onClick={() => addItem("video")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all"
            >
              🎥 Add Video
            </button>
            <button
              onClick={() => addItem("voice")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C47FF] px-3 py-2 rounded-xl border border-[#E5E0F5] hover:border-[#6C47FF]/40 transition-all"
            >
              🎙️ Add Voice
            </button>
          </div>
        </div>

        {/* Publish / Draft toggle */}
        <div className="bg-white rounded-2xl border border-[#E5E0F5] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Draft Mode</div>
              <div className="text-sm text-gray-400 mt-0.5">
                {isDraft ? "Students cannot see this assignment yet." : "This assignment will be visible to students immediately."}
              </div>
            </div>
            <button
              onClick={() => setIsDraft(!isDraft)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDraft ? "bg-gray-200" : "bg-[#47D6B5]"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-0.5 ${isDraft ? "left-0.5" : "left-6"}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onNavigate("assignments")}
            className="px-5 py-2.5 rounded-xl border border-[#E5E0F5] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
              isDraft
                ? "bg-gray-400 hover:bg-gray-500 shadow-gray-200"
                : "bg-[#6C47FF] hover:bg-[#5535e0] shadow-purple-200"
            }`}
          >
            {isDraft ? "Save Draft" : "Publish Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
