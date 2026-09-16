import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Bookmark, HelpCircle, MessageSquare, ExternalLink, Award, RotateCcw, ThumbsUp, Sparkles } from "lucide-react";
import { NewsStory } from "../types";

interface Blink60Props {
  stories: NewsStory[];
  savedStories: string[];
  onToggleSave: (storyId: string) => void;
  onOpenExplain: (story: NewsStory) => void;
  onOpenChat: (story: NewsStory) => void;
  onOpenStoryDetail: (story: NewsStory) => void;
}

const MOTIVATIONS = [
  "Great job! You're now smarter than you were 1 minute ago. 🚀",
  "You are officially in the loop. Have a productive day! ✨",
  "Mind expansion complete. Keep that curiosity alive! 🧠",
  "Short summaries, big brain. You're caught up! ⏱"
];

export default function Blink60({
  stories,
  savedStories,
  onToggleSave,
  onOpenExplain,
  onOpenChat,
  onOpenStoryDetail,
}: Blink60Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [motivationText, setMotivationText] = useState(() => {
    return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  });

  const handleNext = () => {
    if (currentIndex <= stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMotivationText(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
  };

  const isCompleted = currentIndex >= stories.length;
  const activeStory = stories[currentIndex];
  const isSaved = activeStory ? savedStories.includes(activeStory.id) : false;

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-indigo-950 h-[calc(100vh-130px)] overflow-hidden relative">
      
      {/* Top Banner Header inside BLINK 60 */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-sky-100/60 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
          <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase">
            BLINK 60 EXPERIENCE
          </span>
        </div>
        <span className="text-xs font-black text-indigo-400">
          {isCompleted ? "Completed" : `Story ${currentIndex + 1} of ${stories.length}`}
        </span>
      </div>

      {/* Main card panel */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 relative z-10 scrollbar-none flex flex-col justify-start">
        
        {!isCompleted && activeStory ? (
          /* ACTIVE NEWS STORY PANEL */
          <div className="bg-white rounded-3xl p-5 border border-sky-100/50 shadow-md flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Media Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-sky-100/60">
                <img
                  src={activeStory.imageUrl}
                  alt={activeStory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[9px] font-black uppercase text-sky-300 bg-sky-950/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {activeStory.category}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight mt-1">
                    {activeStory.title}
                  </h3>
                </div>
              </div>

              {/* Read estimation and save trigger */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-sky-600 font-black uppercase bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                  <Clock className="w-3 h-3 text-sky-500" />
                  <span>⏱ {activeStory.readTime}</span>
                </div>
                <button
                  onClick={() => onToggleSave(activeStory.id)}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    isSaved
                      ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/10"
                      : "bg-slate-50 border-slate-200 text-indigo-600 hover:bg-sky-50"
                  }`}
                  aria-label="Save story"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Key Story Explanations */}
              <div className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                    What happened?
                  </span>
                  <p className="text-sm font-bold leading-relaxed text-indigo-950">
                    {activeStory.whatHappened || activeStory.summary}
                  </p>
                </div>

                {activeStory.whyItMatters && (
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-50/40 to-indigo-50/40 border border-sky-100/50 space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Why does it matter?
                    </span>
                    <p className="text-xs font-semibold leading-relaxed text-indigo-950/80">
                      {activeStory.whyItMatters}
                    </p>
                  </div>
                )}

                {activeStory.keyPoints && activeStory.keyPoints.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      Key points
                    </span>
                    <ul className="space-y-1.5">
                      {activeStory.keyPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-indigo-900/80 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Action Triggers */}
            <div className="space-y-2.5 pt-2 border-t border-sky-100/40">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onOpenExplain(activeStory)}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/60 text-[10px] font-black uppercase text-sky-600 transition"
                >
                  <HelpCircle className="w-4 h-4 text-sky-500" /> Explain Story
                </button>

                <button
                  onClick={() => onOpenChat(activeStory)}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/60 text-[10px] font-black uppercase text-sky-600 transition"
                >
                  <MessageSquare className="w-4 h-4 text-sky-500" /> Ask AI
                </button>
              </div>

              <button
                onClick={() => onOpenStoryDetail(activeStory)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
              >
                Read Full Story <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* COMPLETION AND CELEBRATION STAGE (Point 5 Motivational message) */
          <div className="bg-white rounded-3xl p-6 border border-sky-100/50 shadow-md text-center space-y-6 py-12 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 animate-bounce">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-2.5">
              <span className="text-[9px] font-black uppercase bg-sky-100/80 text-sky-600 px-3 py-1 rounded-full border border-sky-200">
                You've Completed BLINK 60!
              </span>
              <h3 className="text-2xl font-black text-indigo-950 tracking-tight leading-snug">
                You are officially caught up.
              </h3>
              <p className="text-indigo-900/60 text-xs font-semibold max-w-xs leading-relaxed">
                You just scanned all trending news points in 60-second bites. Well done!
              </p>
            </div>

            {/* Motivational message panel */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-50 via-indigo-50/40 to-purple-50/30 border border-sky-100 text-xs text-indigo-950 font-bold leading-relaxed max-w-xs shadow-sm flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-sky-500 shrink-0" />
              <p className="text-left">{motivationText}</p>
            </div>

            <button
              onClick={handleRestart}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" /> Restart BLINK 60
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons bottom bar */}
      <div className="relative z-10 border-t border-sky-100/60 px-4 py-3 bg-white/90 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            currentIndex === 0
              ? "text-slate-300 cursor-not-allowed"
              : "text-indigo-600 hover:text-black hover:bg-slate-100"
          }`}
        >
          <ChevronUp className="w-4 h-4" /> Prev
        </button>

        <span className="text-[9px] font-black tracking-widest text-indigo-300 uppercase">
          SWIPE OR NAVIGATE
        </span>

        <button
          onClick={handleNext}
          disabled={isCompleted}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            isCompleted
              ? "text-slate-300 cursor-not-allowed"
              : "text-sky-600 hover:text-sky-700 hover:bg-sky-50"
          }`}
        >
          Next <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
