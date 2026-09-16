import React from "react";
import { TrendingTopic } from "../types";
import { Flame } from "lucide-react";

interface TrendingNowProps {
  topics: TrendingTopic[];
  onTopicSelect: (topic: string) => void;
}

export default function TrendingNow({ topics, onTopicSelect }: TrendingNowProps) {
  return (
    <div className="mb-6" id="trending-now-section">
      <div className="flex items-center gap-1.5 mb-3.5 px-1">
        <Flame className="w-5 h-5 text-indigo-500 fill-current animate-pulse" />
        <h3 className="text-lg font-black tracking-tight text-indigo-950">
          Trending topics
        </h3>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-none px-1">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.topic)}
            className="flex-shrink-0 w-36 aspect-[3/4] rounded-3xl overflow-hidden relative shadow-sm hover:shadow-md group focus:outline-none snap-start active:scale-95 border border-sky-100/40 transition-all duration-300"
            id={`trending-${topic.topic.toLowerCase()}`}
          >
            {/* Visual Tinted Soft Overlay for ultimate readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-900/40 to-transparent z-10"></div>

            {/* Thumbnail Image */}
            <img
              src={topic.imageUrl}
              alt={topic.topic}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Topic details and stats */}
            <div className="absolute inset-x-3.5 bottom-3.5 z-20 text-left flex flex-col justify-end">
              <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest leading-none">
                #{topic.position} Trending
              </span>
              <h4 className="text-base font-black text-white leading-tight mt-1 group-hover:text-sky-200 transition-colors duration-200">
                {topic.topic}
              </h4>
              <p className="text-[10px] text-indigo-200/90 font-medium line-clamp-1 mt-0.5">
                {topic.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
