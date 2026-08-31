import { useState } from "react";
import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = (hover || value) >= star;
        const half = !full && (hover || value) >= star - 0.5;
        return (
          <button
            key={star}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setHover(x < rect.width / 2 ? star - 0.5 : star);
            }}
            onMouseLeave={() => setHover(0)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              onChange(x < rect.width / 2 ? star - 0.5 : star);
            }}
            className="text-2xl leading-none transition-transform hover:scale-110"
          >
            {full ? "⭐" : half ? "✨" : "☆"}
          </button>
        );
      })}
      <span className="ml-2 text-sm font-black text-[#FFD147]">{value > 0 ? value.toFixed(1) : "–"}</span>
    </div>
  );
}

const quickComments = [
  { text: "Great job!", emoji: "🌟" },
  { text: "Keep practicing!", emoji: "💪" },
  { text: "Excellent pronunciation!", emoji: "🎯" },
  { text: "Try again, you can do it!", emoji: "😊" },
  { text: "Wonderful effort!", emoji: "⭐" },
  { text: "Fantastic progress!", emoji: "🚀" },
  { text: "I'm so proud of you!", emoji: "❤️" },
];

export default function ReviewSubmission({ onNavigate }: Props) {
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [published, setPublished] = useState(false);
  const [speed, setSpeed] = useState(1);

  const items = [
    { type: "voice", label: "Introduce your family", response: "voice-response.mp3", duration: "0:45" },
    { type: "text", label: "Write three sentences about your family", response: "My name is Emma. I have a mom, a dad, and a little brother. My brother's name is Leo." },
    { type: "video", label: "Show a photo of your family and describe each person", response: "family-video.mp4", duration: "1:12" },
  ];

  const addQuickComment = (text: string, emoji: string) => {
    setFeedback((prev) => (prev ? prev + " " : "") + `${emoji} ${text}`);
  };

  const handlePublish = () => {
    if (ratings.some((r) => r === 0)) return;
    setPublished(true);
    setTimeout(() => onNavigate("pending-queue"), 1500);
  };

  if (published) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">✅</div>
        <h2 className="text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Feedback Published!</h2>
        <p className="text-gray-500">Emma can now see your feedback.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("pending-queue")} className="text-gray-400 hover:text-[#1A1033] transition-colors">
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Review Submission</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-200 text-teal-700 flex items-center justify-center text-sm font-black">EC</div>
          <div>
            <div className="text-sm font-bold text-[#1A1033]">Emma Chen</div>
            <div className="text-xs text-gray-400">Level 1 – Blue · Aug 30, 9:14 AM</div>
          </div>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ On time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: submission items */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#F0EBFF] rounded-2xl px-4 py-3">
            <div className="font-black text-[#6C47FF] text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>
              My Family Introduction
            </div>
            <div className="text-xs text-purple-400">Assignment · Level 1 – Blue</div>
          </div>

          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E0F5] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EBFF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#F0EBFF] text-[#6C47FF] flex items-center justify-center text-xs font-black">{i + 1}</span>
                  <span className="text-sm font-bold text-[#1A1033]">{item.label}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {item.type === "text" ? "📝 Text" : item.type === "video" ? "🎥 Video" : "🎙️ Voice"}
                </span>
              </div>

              <div className="p-5">
                {item.type === "text" ? (
                  <p className="text-sm text-gray-700 leading-relaxed">{item.response}</p>
                ) : (
                  <div className="space-y-3">
                    {/* Fake player */}
                    <div className="bg-[#F4F2F0] rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <button className="w-9 h-9 rounded-full bg-[#6C47FF] text-white flex items-center justify-center text-sm hover:bg-[#5535e0] transition-colors">
                          ▶
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 bg-gray-200 rounded-full">
                            <div className="h-full w-1/3 bg-[#6C47FF] rounded-full" />
                          </div>
                        </div>
                        <span className="text-xs font-mono text-gray-500">{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Speed:</span>
                        {[0.5, 1, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSpeed(s)}
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg transition-colors ${
                              speed === s ? "bg-[#6C47FF] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Per-item rating */}
                <div className="mt-4 pt-4 border-t border-[#F0EBFF]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">Item Rating</span>
                    <StarRating value={ratings[i]} onChange={(v) => setRatings((prev) => prev.map((r, ri) => ri === i ? v : r))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: feedback panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Rating summary */}
          <div className="bg-white rounded-2xl border border-[#E5E0F5] p-5">
            <h3 className="font-black text-[#1A1033] mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Ratings Summary</h3>
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-500 truncate flex-1 mr-2">Item {i + 1}: {item.label.slice(0, 20)}…</span>
                <span className="text-xs font-black text-[#FFD147]">{ratings[i] > 0 ? `${ratings[i].toFixed(1)}⭐` : "–"}</span>
              </div>
            ))}
            {ratings.every((r) => r > 0) && (
              <div className="mt-2 pt-2 border-t border-[#F0EBFF] flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Average</span>
                <span className="text-sm font-black text-[#FFD147]">
                  {(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)}⭐
                </span>
              </div>
            )}
          </div>

          {/* Text feedback */}
          <div className="bg-white rounded-2xl border border-[#E5E0F5] p-5">
            <h3 className="font-black text-[#1A1033] mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Written Feedback</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickComments.map((q) => (
                <button
                  key={q.text}
                  onClick={() => addQuickComment(q.text, q.emoji)}
                  className="text-xs bg-[#F0EBFF] hover:bg-[#6C47FF] hover:text-white text-[#6C47FF] font-semibold px-2.5 py-1 rounded-full transition-colors"
                >
                  {q.emoji} {q.text}
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
              placeholder="Write your personalized feedback…"
              rows={4}
              className="w-full border border-[#E5E0F5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#6C47FF] resize-none transition-colors"
            />
            <div className="text-xs text-gray-400 text-right mt-1">{feedback.length}/500</div>
          </div>

          {/* Voice feedback */}
          <div className="bg-white rounded-2xl border border-[#E5E0F5] p-5">
            <h3 className="font-black text-[#1A1033] mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>Voice Feedback</h3>
            <p className="text-xs text-gray-400 mb-3">Optional · max 1 minute</p>
            {hasVoice ? (
              <div className="bg-[#F4F2F0] rounded-xl p-3 flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-[#6C47FF] text-white text-sm flex items-center justify-center">▶</button>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full"><div className="w-full h-full bg-[#47D6B5] rounded-full" /></div>
                <span className="text-xs font-mono text-gray-500">0:28</span>
                <button onClick={() => setHasVoice(false)} className="text-gray-300 hover:text-red-400 transition-colors">×</button>
              </div>
            ) : (
              <button
                onClick={() => { setIsRecording(!isRecording); if (isRecording) setHasVoice(true); }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-bold text-sm transition-all ${
                  isRecording
                    ? "border-red-300 text-red-500 bg-red-50 animate-pulse"
                    : "border-[#E5E0F5] text-gray-400 hover:border-[#6C47FF]/40 hover:text-[#6C47FF]"
                }`}
              >
                🎙️ {isRecording ? "Recording… Click to stop" : "Record voice feedback"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {ratings.some((r) => r === 0) && (
              <p className="text-xs text-orange-500 text-center">⚠️ All items need a rating before publishing</p>
            )}
            <button className="w-full py-2.5 rounded-xl border border-[#E5E0F5] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={ratings.some((r) => r === 0)}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                ratings.some((r) => r === 0)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#6C47FF] hover:bg-[#5535e0] text-white shadow-lg shadow-purple-200"
              }`}
            >
              Publish Feedback →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
