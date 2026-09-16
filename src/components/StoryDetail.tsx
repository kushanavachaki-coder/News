import React from "react";
import { ArrowLeft, Clock, Bookmark, HelpCircle, MessageSquare, ExternalLink, Calendar, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { NewsStory } from "../types";

interface StoryDetailProps {
  story: NewsStory;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenExplain: () => void;
  onOpenChat: () => void;
}

export default function StoryDetail({
  story,
  onBack,
  isSaved,
  onToggleSave,
  onOpenExplain,
  onOpenChat,
}: StoryDetailProps) {
  return (
    <div className="flex-1 bg-white flex flex-col min-h-[85vh] animate-slide-in" id={`story-detail-${story.id}`}>
      
      {/* Detail Header bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-sky-100/50 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-50 text-indigo-950 hover:bg-sky-50 hover:text-sky-600 active:scale-95 transition-all duration-200 flex items-center justify-center border border-slate-100"
          id="detail-back-btn"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>

        <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
          Curated Digest Detail
        </span>

        <button
          onClick={onToggleSave}
          className={`p-2.5 rounded-xl transition-all duration-200 border ${
            isSaved ? "bg-sky-500 border-sky-500 text-white shadow-sm" : "bg-slate-50 border-slate-100 text-indigo-600 hover:bg-sky-50"
          }`}
          aria-label="Save story"
          id="detail-save-btn"
        >
          <Bookmark className={`w-4.5 h-4.5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="px-4 py-5 space-y-6 overflow-y-auto flex-1">
        
        {/* Category & Title */}
        <div className="space-y-2.5 text-left">
          <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full w-fit block">
            {story.category}
          </span>
          <h1 className="text-2xl font-black text-indigo-950 leading-tight tracking-tight">
            {story.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-sm border border-sky-100/60 bg-slate-50">
          <img
            src={story.imageUrl}
            alt={story.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metainfo metrics */}
        <div className="flex items-center justify-between border-y border-sky-100/50 py-3.5 text-xs text-indigo-900/60 font-semibold text-left">
          <div className="flex flex-col">
            <span className="font-bold text-indigo-950">{story.source}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Published {story.publishedAt}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>⏱ {story.readTime}</span>
          </div>
        </div>

        {/* 1-Minute Summary Banner in Pastel Light Gradient style */}
        <div className="p-5.5 rounded-3xl bg-gradient-to-tr from-sky-50 via-indigo-50/55 to-purple-50/30 text-indigo-950 space-y-2 border border-sky-100 relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-sky-300/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-sky-600">
              {(!story.whyItMatters || story.whyItMatters.trim() === "") ? "Processing Story..." : "1-Minute AI Summary"}
            </span>
          </div>
          {(!story.whyItMatters || story.whyItMatters.trim() === "") ? (
            <div className="flex items-center gap-2 text-indigo-600/80 mt-1 animate-pulse font-bold text-xs">
              <Sparkles className="w-4 h-4 animate-spin text-sky-500" />
              <span>Generating AI Blink Summary...</span>
            </div>
          ) : (
            <p className="text-base font-bold leading-relaxed text-indigo-950">
              {story.summary}
            </p>
          )}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 text-left">
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              What Happened?
            </h4>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {story.whatHappened || story.summary}
            </p>
          </div>

          {/* Key points */}
          {story.keyPoints && story.keyPoints.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                Key Highlights
              </h4>
              <ul className="space-y-2">
                {story.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why It Matters */}
          {story.whyItMatters && (
            <div className="p-4.5 rounded-2xl bg-gradient-to-tr from-sky-50/50 to-indigo-50/50 border border-sky-100/50 space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-sky-500" /> Why It Matters
              </h4>
              <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                {story.whyItMatters}
              </p>
            </div>
          )}

          {/* Background */}
          {story.background && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                Background Context
              </h4>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {story.background}
              </p>
            </div>
          )}
        </div>

        {/* Section: News Timeline */}
        {story.timeline && story.timeline.length > 0 && (
          <div className="space-y-4 pt-4.5 border-t border-sky-100/50 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-indigo-400" /> Event Timeline
            </h4>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-100">
              {story.timeline.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Timeline node dot */}
                  <div className="absolute -left-[21.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-sky-500 transition-all duration-200 group-hover:scale-110 shadow-sm"></div>
                  
                  {/* Timeline card contents */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                      {item.time}
                    </span>
                    <p className="text-sm font-bold text-indigo-950 leading-snug">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action triggers */}
        <div className="pt-6 border-t border-sky-100/50 space-y-3">
          <button
            onClick={onOpenExplain}
            className="w-full py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-indigo-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200/60 shadow-sm"
            id="detail-explain-btn"
          >
            <HelpCircle className="w-4 h-4 text-sky-500" /> Explain This News
          </button>

          <button
            onClick={onOpenChat}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
            id="detail-ask-btn"
          >
            <MessageSquare className="w-4 h-4" /> Ask AI Story Coach
          </button>
        </div>

        {/* Source link info */}
        <div className="pt-4 border-t border-sky-100/50 text-[10px] text-slate-400 space-y-2.5">
          <p className="leading-relaxed">
            ✨ AI summaries are fully structured to preserve raw journalistic facts. No speculation or editorializing.
          </p>
          <a
            href={story.originalUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border border-slate-200 hover:border-slate-300 text-indigo-950 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            Read original source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
