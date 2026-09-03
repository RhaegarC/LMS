import { Page } from "../components/Layout";

interface Props {
  onNavigate: (page: Page) => void;
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-lg ${(value) >= s ? "text-[#FFD147]" : value >= s - 0.5 ? "text-yellow-300" : "text-gray-200"}`}>
          ★
        </span>
      ))}
      <span className="ml-1.5 text-sm font-black text-[#1A1033]">{value.toFixed(1)}</span>
    </div>
  );
}

const feedbackItems = [
  { label: "Introduce your family", type: "voice", duration: "0:45", rating: 4.5 },
  { label: "Write three sentences about your family", type: "text", rating: 5.0, response: "My name is Emma. I have a mom, a dad, and a little brother. My brother's name is Leo." },
  { label: "Show your family photo and describe each person", type: "video", duration: "1:12", rating: 3.5 },
];

export default function ViewFeedback({ onNavigate }: Props) {
  const avgRating = feedbackItems.reduce((a, b) => a + b.rating, 0) / feedbackItems.length;

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("student-dashboard")} className="text-gray-400 hover:text-[#1A1033] transition-colors">← Back</button>
      </div>

      {/* Assignment info */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-[#47D6B5] mb-1">Feedback Received 🌟</div>
        <h1 className="text-3xl font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>
          Numbers 1–10 Reading
        </h1>
        <div className="text-sm text-gray-400 mt-1">Level 1 – Blue · Published Aug 22, 2026</div>
      </div>

      {/* Overall score hero */}
      <div className="bg-gradient-to-br from-[#1A0F3C] to-[#4A2FA0] rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute right-12 bottom-2 w-10 h-10 bg-[#FFD147]/20 rotate-45" />
        <div className="relative z-10">
          <div className="text-sm text-purple-300 mb-2">Your overall score</div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-6xl font-black" style={{ fontFamily: "Nunito, sans-serif" }}>{avgRating.toFixed(1)}</div>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-2xl ${avgRating >= s ? "text-[#FFD147]" : avgRating >= s - 0.5 ? "text-yellow-400/60" : "text-white/20"}`}>★</span>
                ))}
              </div>
            </div>
            <div className="pb-1 text-purple-200 text-sm">out of 5.0 ⭐</div>
          </div>
        </div>
      </div>

      {/* Per-item ratings */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EBFF]">
          <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Item Ratings</h2>
        </div>
        <div className="divide-y divide-[#F0EBFF]">
          {feedbackItems.map((item, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-md bg-[#F0EBFF] text-[#6C47FF] flex items-center justify-center text-xs font-black">{i + 1}</span>
                    <span className="text-sm font-bold text-[#1A1033]">{item.label}</span>
                    <span className="text-xs text-gray-400">
                      {item.type === "voice" ? "🎙️" : item.type === "video" ? "🎥" : "📝"}
                    </span>
                  </div>
                  {item.type === "text" && (
                    <p className="text-sm text-gray-600 bg-[#FAFAF5] rounded-xl px-3 py-2.5 mb-2">{item.response}</p>
                  )}
                  {item.type !== "text" && (
                    <div className="bg-[#F4F2F0] rounded-xl p-3 flex items-center gap-3 mb-2">
                      <button className="w-8 h-8 rounded-full bg-[#6C47FF] text-white flex items-center justify-center text-xs">▶</button>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full"><div className="w-1/3 h-full bg-[#6C47FF] rounded-full" /></div>
                      <span className="text-xs font-mono text-gray-400">{item.duration}</span>
                    </div>
                  )}
                </div>
                <div className="flex-none">
                  <StarDisplay value={item.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher written feedback */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EBFF]">
          <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Teacher's Message</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            🌟 Great job Emma! Your pronunciation is really improving! 💪 Keep practicing the numbers — you're almost perfect.
            I especially loved how you said "seven" and "eleven" — that's tricky for many students!
            🎯 Excellent effort on this assignment. I'm so proud of you! ❤️
          </p>
        </div>
      </div>

      {/* Voice feedback */}
      <div className="bg-white rounded-2xl border border-[#E5E0F5] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EBFF]">
          <h2 className="font-black text-[#1A1033]" style={{ fontFamily: "Nunito, sans-serif" }}>Voice Message from Ms. Johnson</h2>
        </div>
        <div className="p-5">
          <div className="bg-[#F4F2F0] rounded-xl p-4 flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#6C47FF] text-white flex items-center justify-center text-base">▶</button>
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full"><div className="w-0 h-full bg-[#6C47FF] rounded-full" /></div>
              <div className="text-xs text-gray-400 mt-1">0:00 / 0:28</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => onNavigate("student-dashboard")}
          className="bg-[#6C47FF] hover:bg-[#5535e0] text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Assignments 🏠
        </button>
      </div>
    </div>
  );
}
