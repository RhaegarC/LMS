import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

type ContentType = "text" | "image" | "video";
type ExplainType = "text" | "voice";
type ResponseStatus = "empty" | "recording" | "done";

interface HomeworkItem {
  id: number;
  contentType: ContentType;
  content: string;
  explanation?: { type: ExplainType; content: string };
  responseStatus: ResponseStatus;
  responseText: string;
}

const contentIcon: Record<ContentType, string> = { text: "📝", image: "🖼️", video: "🎬" };
const contentLabel: Record<ContentType, string> = { text: "Text", image: "Image", video: "Video" };

export default function SubmitAssignment({ onNavigate }: Props) {
  const [items, setItems] = useState<HomeworkItem[]>([
    {
      id: 1, contentType: "image", content: "family-photo.jpg",
      explanation: { type: "voice", content: "voice-explain-1.mp3" },
      responseStatus: "empty", responseText: "",
    },
    {
      id: 2, contentType: "text",
      content: "Write three sentences about your family. Tell us who is in your family and what they like to do!",
      explanation: { type: "text", content: "Use words like: mother, father, brother, sister, grandma, grandpa." },
      responseStatus: "empty", responseText: "",
    },
    {
      id: 3, contentType: "video", content: "family-intro-example.mp4",
      responseStatus: "empty", responseText: "",
    },
  ]);

  const [isRecording, setIsRecording] = useState<number | null>(null);
  const [playingExplain, setPlayingExplain] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const updateResponseText = (id: number, text: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, responseText: text, responseStatus: text.trim() ? "done" : "empty" } : item
    ));
  };

  const toggleRecording = (id: number) => {
    if (isRecording === id) {
      setIsRecording(null);
      setItems(prev => prev.map(item => item.id === id ? { ...item, responseStatus: "done" } : item));
    } else {
      setIsRecording(id);
      setItems(prev => prev.map(item => item.id === id ? { ...item, responseStatus: "recording" } : item));
    }
  };

  const clearResponse = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, responseStatus: "empty", responseText: "" } : item
    ));
  };

  const allDone = items.every(i => i.responseStatus === "done");
  const doneCount = items.filter(i => i.responseStatus === "done").length;

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
        <p className="text-lg text-gray-500 mb-2">Your homework has been submitted!</p>
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
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => onNavigate("student-dashboard")} className="text-gray-400 hover:text-[#1A1033] transition-colors text-sm">
          ← Back
        </button>
      </div>

      {/* Homework title */}
      <div className="mb-5">
        <div className="text-xs font-semibold text-[#6C47FF] mb-1">Level 1 – Blue · Sep 5, 2026</div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          My Family Introduction
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-gray-500">Due Sep 12, 2026</span>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">7 days left</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{doneCount} of {items.length} tasks completed</span>
          <span>{Math.round((doneCount / items.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6C47FF] to-[#47D6B5] rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-5 mb-8">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
              item.responseStatus === "done"
                ? "border-[#47D6B5]"
                : item.responseStatus === "recording"
                ? "border-[#FF6B47]"
                : "border-[#E5E0F5]"
            }`}
          >
            {/* Item header */}
            <div className="px-4 sm:px-5 py-3 flex items-center gap-3 border-b border-[#F0EBFF] bg-[#FAFAF5]">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-none transition-colors ${
                item.responseStatus === "done" ? "bg-[#47D6B5] text-white" : "bg-[#F0EBFF] text-[#6C47FF]"
              }`}>
                {item.responseStatus === "done" ? "✓" : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black bg-[#F0EBFF] text-[#6C47FF] px-2 py-0.5 rounded-full">
                    {contentIcon[item.contentType]} {contentLabel[item.contentType]}
                  </span>
                  {item.explanation && (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {item.explanation.type === "voice" ? "🎙️ Explanation" : "📝 Explanation"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* ── Item content ── */}
              {item.contentType === "text" && (
                <div className="bg-[#F0EBFF] rounded-xl px-4 py-3 text-sm text-[#1A1033] leading-relaxed">
                  {item.content}
                </div>
              )}

              {item.contentType === "image" && (
                <div className="bg-gradient-to-br from-pink-100 to-amber-100 rounded-xl h-40 sm:h-52 flex flex-col items-center justify-center gap-2 border border-pink-200">
                  <span className="text-5xl">🖼️</span>
                  <span className="text-xs text-gray-400 font-semibold">{item.content}</span>
                </div>
              )}

              {item.contentType === "video" && (
                <div className="bg-[#F4F2F0] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-[#6C47FF] text-white flex items-center justify-center text-sm hover:bg-[#5535e0] transition-colors flex-none">
                      ▶
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 bg-gray-200 rounded-full">
                        <div className="h-full w-0 bg-[#6C47FF] rounded-full" />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{item.content}</div>
                    </div>
                    <span className="text-xs font-mono text-gray-500 flex-none">1:24</span>
                  </div>
                </div>
              )}

              {/* ── Optional explanation ── */}
              {item.explanation && (
                <div className="border border-amber-200 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-amber-50 flex items-center gap-2">
                    <span className="text-xs font-black text-amber-700">
                      {item.explanation.type === "voice" ? "🎙️" : "📝"} Teacher's explanation
                    </span>
                  </div>
                  {item.explanation.type === "text" ? (
                    <div className="px-4 py-3 text-sm text-gray-600 leading-relaxed">
                      {item.explanation.content}
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPlayingExplain(playingExplain === item.id ? null : item.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors flex-none ${
                            playingExplain === item.id
                              ? "bg-amber-400 text-white"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                        >
                          {playingExplain === item.id ? "⏸" : "▶"}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-amber-100 rounded-full">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: playingExplain === item.id ? "45%" : "0%" }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-mono text-amber-600 flex-none">0:18</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Student response ── */}
              <div className="pt-1">
                <div className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Your answer</div>
                {item.responseStatus === "done" ? (
                  <div className="bg-[#F0EBFF]/60 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#47D6B5] text-white flex items-center justify-center text-sm flex-none">✓</div>
                    <div className="flex-1 min-w-0">
                      {item.responseText ? (
                        <p className="text-sm text-gray-700 truncate">{item.responseText}</p>
                      ) : (
                        <p className="text-sm text-[#47D6B5] font-semibold">Recorded ✓</p>
                      )}
                    </div>
                    <button
                      onClick={() => clearResponse(item.id)}
                      className="text-xs font-bold text-gray-400 hover:text-[#FF6B47] transition-colors flex-none"
                    >
                      Redo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Text response */}
                    <textarea
                      value={item.responseText}
                      onChange={(e) => updateResponseText(item.id, e.target.value)}
                      placeholder="Write your answer here… 😊"
                      rows={3}
                      className="w-full border border-[#E5E0F5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">or</span>
                      <button
                        onClick={() => toggleRecording(item.id)}
                        className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all ${
                          isRecording === item.id
                            ? "border-[#FF6B47] bg-red-50 text-red-500"
                            : "border-[#E5E0F5] text-gray-500 hover:border-[#6C47FF]/40 hover:text-[#6C47FF]"
                        }`}
                      >
                        <span>{isRecording === item.id ? "⏹" : "🎙️"}</span>
                        {isRecording === item.id ? (
                          <span className="animate-pulse">Stop recording</span>
                        ) : (
                          <span>Record voice</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="sticky bottom-6">
        <div className={`rounded-2xl p-4 shadow-xl transition-colors ${allDone ? "bg-[#6C47FF]" : "bg-gray-200"}`}>
          <button
            onClick={() => { if (allDone) { setShowConfetti(true); setSubmitted(true); } }}
            disabled={!allDone}
            className="w-full text-center font-black text-lg"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {allDone ? (
              <span className="text-white">Submit Homework 🚀</span>
            ) : (
              <span className="text-gray-400">Complete all {items.length} tasks to submit</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
