import React, { useState, useEffect } from "react";
import { Play, X, ArrowRight, CheckCircle2, RotateCcw, Clock, Sparkles } from "lucide-react";
import { NewsStory } from "../types";

interface DailyBriefingProps {
  stories: NewsStory[];
  onOpenStory: (story: NewsStory) => void;
}

export default function DailyBriefing({ stories, onOpenStory }: DailyBriefingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState("Good morning");

  // Filter 5 stories to serve as the structured morning/evening flash briefing
  const briefingStories = stories.slice(0, 5);

  // Set greeting depending on the active hours of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentIndex < briefingStories.length - 1) {
              setCurrentIndex((idx) => idx + 1);
              return 0;
            } else {
              // Reached completion stage
              setCurrentIndex(briefingStories.length);
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 1.8; // Briefing speed multiplier
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentIndex, briefingStories.length]);

  const handleNext = () => {
    if (currentIndex < briefingStories.length) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      if (currentIndex === briefingStories.length - 1) {
        setIsPlaying(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleStartBriefing = () => {
    setIsOpen(true);
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const activeStory = briefingStories[currentIndex];

  return (
    <div className="mb-6" id="daily-briefing-widget">
      {/* Widget Card - Premium Light Theme Pastel Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-50 via-indigo-50/70 to-purple-50/50 p-5.5 text-neutral-800 shadow-sm border border-sky-100/60">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-sky-300/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-purple-300/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black tracking-widest text-sky-600 bg-sky-100/60 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3 fill-current animate-pulse text-sky-500" /> Daily Briefing
            </span>
            <h3 className="text-2xl font-black tracking-tight leading-tight text-indigo-950">
              {greeting}
            </h3>
            <p className="text-xs text-indigo-900/60 font-medium">
              Catch up on the 5 most important stories before you blink.
            </p>
          </div>
          <button
            onClick={handleStartBriefing}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-sky-500/10"
            id="start-briefing-btn"
          >
            <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="mt-5 pt-3.5 border-t border-sky-100/80 flex items-center justify-between text-xs text-indigo-900/60 font-semibold">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>⏱ ~2 min briefing</span>
          </div>
          <div className="flex gap-1">
            {briefingStories.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-sky-200"
                style={{
                  backgroundColor: i < 5 ? "#0ea5e9" : undefined,
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Story Overlay Modal - Light Theme Immersive Carousel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col md:max-w-md md:mx-auto md:border-x md:border-slate-200 animate-fade-in">
          
          {/* Header Indicators */}
          <div className="px-4 pt-4 pb-2 space-y-3.5 bg-white border-b border-sky-100/50 shadow-sm">
            <div className="flex gap-1.5">
              {briefingStories.map((_, index) => {
                let barWidth = "0%";
                if (index < currentIndex) barWidth = "100%";
                else if (index === currentIndex) barWidth = `${progress}%`;

                return (
                  <div
                    key={index}
                    className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-75 ease-out"
                      style={{ width: barWidth }}
                    ></div>
                  </div>
                );
              })}
              {/* Extra bar for completion screen */}
              <div className="h-1 w-6 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: currentIndex >= briefingStories.length ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Briefing {currentIndex < briefingStories.length ? `${currentIndex + 1}/5` : "Done"}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {currentIndex < briefingStories.length ? activeStory.category : "Completed"}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 active:scale-95 transition-all duration-200"
                id="close-briefing-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 px-5 py-5 flex flex-col justify-between overflow-y-auto">
            {currentIndex < briefingStories.length ? (
              /* Active Story Page */
              <div className="flex-1 flex flex-col justify-between space-y-6">
                
                {/* News Image Backdrop */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-sky-100 bg-slate-100">
                  <img
                    src={activeStory.imageUrl}
                    alt={activeStory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {activeStory.source}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 leading-snug line-clamp-2">
                      {activeStory.title}
                    </h4>
                  </div>
                </div>

                {/* Summarized Content in Light Theme */}
                <div className="space-y-4 flex-1 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                      What happened
                    </span>
                    <p className="text-base font-bold text-indigo-950 leading-relaxed">
                      {activeStory.summary}
                    </p>
                  </div>

                  {activeStory.whyItMatters && (
                    <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-50/50 to-indigo-50/50 border border-sky-100/50 space-y-0.5">
                      <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase">
                        Why it matters
                      </span>
                      <p className="text-xs text-indigo-950/80 font-semibold leading-relaxed">
                        {activeStory.whyItMatters}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions inside Modal */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onOpenStory(activeStory);
                      handleClose();
                    }}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-indigo-600/15"
                  >
                    Read full story <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Catch Up Celebratory Screen - Light Premium Accent Design */
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-4">
                <div className="w-18 h-18 rounded-3xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-500 animate-bounce shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                    Briefing Completed
                  </span>
                  <h3 className="text-2xl font-black text-indigo-950 tracking-tight leading-tight">
                    You're caught up!
                  </h3>
                  <p className="text-indigo-900/60 text-xs font-semibold max-w-xs mx-auto">
                    You've successfully consumed today's key stories and briefings in less than 2 minutes.
                  </p>
                </div>

                {/* Session stats scorecard */}
                <div className="w-full p-4 rounded-2xl bg-white border border-sky-100/60 shadow-sm space-y-3 text-left">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                    Session Analytics
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/50">
                      <span className="text-[10px] text-indigo-900/50 font-bold block">Stories Read</span>
                      <span className="text-lg font-black text-indigo-950">5 of 5</span>
                    </div>
                    <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
                      <span className="text-[10px] text-indigo-900/50 font-bold block">Estimated Saving</span>
                      <span className="text-lg font-black text-purple-600">~22 mins</span>
                    </div>
                  </div>
                </div>

                {/* Optional Motivational Quotes / Surprise element */}
                <div className="text-[11px] text-indigo-400 italic font-semibold max-w-xs bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/30">
                  "Great job! You're now smarter than you were 1 minute ago. 🚀"
                </div>

                <div className="flex gap-2.5 w-full pt-4">
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-3.5 rounded-xl border border-sky-200 bg-white hover:bg-slate-50 text-indigo-900/70 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> Repeat
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase flex items-center justify-center shadow-md shadow-indigo-600/10"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Navigation controls for Modal */}
          <div className="bg-white border-t border-sky-100/80 p-4 flex justify-between items-center text-indigo-950 font-bold">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`text-xs font-black uppercase py-2 px-4 rounded-xl transition-all ${
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
              }`}
            >
              Prev
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-indigo-600 rounded-xl text-xs font-black transition-all"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= briefingStories.length}
              className={`text-xs font-black uppercase py-2 px-4 rounded-xl text-sky-600 transition-all ${
                currentIndex >= briefingStories.length ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
              }`}
            >
              {currentIndex === briefingStories.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
