import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

type ItemStatus = "empty" | "recording" | "done";

interface ResponseItem {
  id: number;
  type: "voice" | "text" | "video";
  label: string;
  instruction: string;
  status: ItemStatus;
  textContent: string;
}

export default function SubmitAssignment({ onNavigate }: Props) {
  const [items, setItems] = useState<ResponseItem[]>([
    { id: 1, type: "voice", label: "Introduce your family", instruction: "Record yourself saying your family members' names and what they do.", status: "empty", textContent: "" },
    { id: 2, type: "text", label: "Write three sentences about your family", instruction: "Write at least 3 sentences. Tell us who is in your family!", status: "empty", textContent: "" },
    { id: 3, type: "video", label: "Show your family photo and describe each person", instruction: "Hold up a photo of your family and tell us about each person in English.", status: "empty", textContent: "" },
  ]);
  const [isRecording, setIsRecording] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const updateText = (id: number, text: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, textContent: text, status: text.trim() ? "done" : "empty" } : item
    ));
  };

  const toggleRecording = (id: number) => {
    if (isRecording === id) {
      setIsRecording(null);
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "done" } : item));
    } else {
      setIsRecording(id);
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "recording" } : item));
    }
  };

  const allDone = items.every((i) => i.status === "done");

  const handleSubmit = () => {
    if (!allDone) return;
    setShowConfetti(true);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  backgroundColor: ["#6C47FF", "#FF6B47", "#FFD147", "#47D6B5"][i % 4],
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${0.5 + Math.random() * 1}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-4xl font-black text-[#1A1033] mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>
          Amazing Job, Emma!
        </h1>
        <p className="text-lg text-gray-500 mb-2">Your assignment has been submitted!</p>
        <p className="text-sm text-gray-400 mb-8">Your teacher will review it soon ⭐</p>
        <button
          onClick={() => onNavigate("student-dashboard")}
          className="bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-purple-200"
        >
          Back to My Assignments
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("student-dashboard")} className="text-gray-400 hover:text-[#1A1033] transition-colors">
          ← Back
        </button>
      </div>

      {/* Assignment title */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-[#47D6B5] mb-1">Level 1 – Blue</div>
        <h1 className="text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          My Family Introduction
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-gray-500">Due Sep 5, 2026</span>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">6 days left</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{items.filter((i) => i.status === "done").length} of {items.length} tasks completed</span>
          <span>{Math.round((items.filter((i) => i.status === "done").length / items.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6C47FF] to-[#47D6B5] rounded-full transition-all duration-500"
            style={{ width: `${(items.filter((i) => i.status === "done").length / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-5 mb-8">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border-2 transition-all ${
              item.status === "done"
                ? "border-[#47D6B5]"
                : item.status === "recording"
                ? "border-[#FF6B47]"
                : "border-[#E5E0F5]"
            }`}
          >
            {/* Item header */}
            <div className="px-5 py-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-none ${
                item.status === "done"
                  ? "bg-[#47D6B5] text-white"
                  : "bg-[#F0EBFF] text-[#6C47FF]"
              }`}>
                {item.status === "done" ? "✓" : idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-black text-[#1A1033] text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item.type === "voice" ? "🎙️ Voice recording" : item.type === "video" ? "🎥 Video recording" : "📝 Written response"}
                </div>
              </div>
            </div>

            {/* Instruction */}
            <div className="px-5 pb-4">
              <div className="text-sm text-gray-500 bg-[#FAFAF5] rounded-xl px-4 py-3 mb-4 border border-[#F0EBFF]">
                📌 {item.instruction}
              </div>

              {/* Response area */}
              {item.type === "text" ? (
                <textarea
                  value={item.textContent}
                  onChange={(e) => updateText(item.id, e.target.value)}
                  placeholder="Write your answer here… 😊"
                  rows={4}
                  className="w-full border border-[#E5E0F5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
                />
              ) : (
                <div className="space-y-3">
                  {item.status === "done" ? (
                    <div className="bg-[#F4F2F0] rounded-xl p-4 flex items-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-[#47D6B5] text-white flex items-center justify-center text-sm">▶</button>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div className="w-full h-full bg-[#47D6B5] rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-gray-500">
                        {item.type === "video" ? "0:58" : "0:32"}
                      </span>
                      <button
                        onClick={() => setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "empty" } : i))}
                        className="text-xs font-bold text-gray-400 hover:text-[#FF6B47] transition-colors"
                      >
                        Re-record
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleRecording(item.id)}
                      className={`w-full py-6 rounded-xl border-2 border-dashed font-bold text-sm transition-all flex flex-col items-center gap-2 ${
                        item.status === "recording"
                          ? "border-[#FF6B47] bg-red-50 text-red-500"
                          : "border-[#E5E0F5] text-gray-400 hover:border-[#6C47FF]/40 hover:text-[#6C47FF]"
                      }`}
                    >
                      <span className="text-3xl">{item.type === "video" ? "🎥" : "🎙️"}</span>
                      {item.status === "recording" ? (
                        <>
                          <span className="animate-pulse">Recording… tap to stop</span>
                          <span className="text-xs font-mono text-red-400">● 0:12</span>
                        </>
                      ) : (
                        <span>Tap to {item.type === "video" ? "record video" : "record voice"}</span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="sticky bottom-6">
        <div className={`rounded-2xl p-4 shadow-xl ${allDone ? "bg-[#6C47FF]" : "bg-gray-200"} transition-colors`}>
          <button
            onClick={handleSubmit}
            disabled={!allDone}
            className="w-full text-center font-black text-lg transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {allDone ? (
              <span className="text-white">Submit Assignment 🚀</span>
            ) : (
              <span className="text-gray-400">Complete all {items.length} tasks to submit</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
