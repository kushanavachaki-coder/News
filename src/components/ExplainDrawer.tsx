import React, { useState, useEffect } from "react";
import { X, Sparkles, HelpCircle, AlertCircle, ArrowUpRight, BookOpen } from "lucide-react";
import { NewsStory } from "../types";

interface ExplainDrawerProps {
  story: NewsStory | null;
  onClose: () => void;
}

interface ExplanationData {
  whatHappened: string;
  whyImportant: string;
  background: string;
  whoIsAffected: string;
  whatHappensNext: string;
  isSimulated?: boolean;
}

export default function ExplainDrawer({ story, onClose }: ExplainDrawerProps) {
  const [data, setData] = useState<ExplanationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Collecting source article...",
    "Extracting headline & contents...",
    "Detecting duplicate reporting patterns...",
    "Generating context-aware explanation...",
    "Finalizing structured summary..."
  ];

  useEffect(() => {
    if (!story) return;

    setIsLoading(true);
    setError(null);
    setData(null);
    setLoadingStep(0);

    // Dynamic loading step text transitions
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    // Fetch call to server API
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load explanation.");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => {
        console.error("Explain error:", err);
        setError("Unable to process request right now. Please check your connection.");
      })
      .finally(() => {
        setIsLoading(false);
        clearInterval(stepInterval);
      });

    return () => clearInterval(stepInterval);
  }, [story]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center md:max-w-md md:mx-auto animate-fade-in">
      {/* Drawer content panel */}
      <div className="bg-white w-full max-h-[90vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border-t border-sky-100/55">
        
        {/* Drag handle decoration */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3"></div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-start justify-between border-b border-sky-100/40 bg-white">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black tracking-widest text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3 text-sky-500 fill-current animate-pulse" /> AI EXPLAINER
            </span>
            <h3 className="text-xl font-black text-indigo-950 tracking-tight leading-tight">
              Explain This News
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              Analyzing: {story.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-indigo-950 hover:bg-slate-200 active:scale-95 transition-all duration-200"
            id="close-explain-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 bg-slate-50/50">
          {isLoading ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-sky-500 animate-spin"></div>
                <HelpCircle className="w-6 h-6 absolute text-sky-500 animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-indigo-950 transition-all duration-300">
                  {loadingSteps[loadingStep]}
                </p>
                <p className="text-xs text-slate-400">
                  Powering summaries with Gemini AI
                </p>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center border border-red-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 font-bold">{error}</p>
            </div>
          ) : data ? (
            /* Explanation Content */
            <div className="space-y-6 text-left">
              
              {data.isSimulated && (
                <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/50 text-xs text-sky-800 space-y-1">
                  <span className="font-bold block">💡 Local Preview Mode</span>
                  <span>Add your <b>GEMINI_API_KEY</b> in Settings to let the live AI generate dynamic summaries!</span>
                </div>
              )}

              {/* 1. What Happened */}
              <div className="space-y-1 bg-white p-4 rounded-2xl border border-sky-100/40 shadow-sm">
                <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest block">
                  1. What happened?
                </span>
                <p className="text-sm text-indigo-950 font-bold leading-relaxed">
                  {data.whatHappened}
                </p>
              </div>

              {/* 2. Why is it important */}
              <div className="space-y-1 bg-white p-4 rounded-2xl border border-sky-100/40 shadow-sm">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                  2. Why is it important?
                </span>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  {data.whyImportant}
                </p>
              </div>

              {/* 3. Background */}
              <div className="space-y-1 bg-white p-4 rounded-2xl border border-sky-100/40 shadow-sm">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                  3. Background
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  {data.background}
                </p>
              </div>

              {/* 4. Who is affected */}
              <div className="space-y-1 bg-white p-4 rounded-2xl border border-sky-100/40 shadow-sm">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                  4. Who is affected?
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  {data.whoIsAffected}
                </p>
              </div>

              {/* 5. What happens next */}
              <div className="space-y-1 bg-white p-4 rounded-2xl border border-sky-100/40 shadow-sm">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                  5. What happens next?
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  {data.whatHappensNext}
                </p>
              </div>

              {/* Source Transparency details */}
              <div className="pt-3 text-[10px] text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Reporting: <b>{story.source}</b></span>
                  <span>Published: <b>{story.publishedAt}</b></span>
                </div>
                <p className="leading-normal italic">
                  ✨ AI summary based on facts from {story.source}. We preserve facts without speculation.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Link */}
        <div className="bg-white px-5 py-4.5 border-t border-sky-100/50 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 text-slate-500">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold">Original Publisher</span>
          </div>
          <a
            href={story.originalUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
          >
            Read source <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
