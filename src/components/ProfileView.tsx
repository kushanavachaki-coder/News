import React from "react";
import { UserProfile, NewsStory } from "../types";
import { Check, Settings, Shield, Bell, Sparkles, Sliders, ListFilter, Award, Clock, Flame, Bookmark, ArrowRight, Trash2 } from "lucide-react";

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  savedStories: NewsStory[];
  onRemoveSaved: (storyId: string) => void;
  onOpenStoryDetail: (story: NewsStory) => void;
  userEmail?: string;
  onLogout: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const TOPICS = [
  "India",
  "World",
  "Business",
  "Technology",
  "AI",
  "Sports",
  "Science",
  "Biotechnology",
  "Space",
  "Environment",
  "Entertainment",
  "Gaming"
];

export default function ProfileView({
  profile,
  onUpdateProfile,
  savedStories,
  onRemoveSaved,
  onOpenStoryDetail,
  userEmail,
  onLogout,
  isLoading,
  error,
}: ProfileViewProps) {
  const toggleInterest = (topic: string) => {
    const isSelected = profile.interests.includes(topic);
    let updatedInterests: string[];
    if (isSelected) {
      updatedInterests = profile.interests.filter((t) => t !== topic);
    } else {
      updatedInterests = [...profile.interests, topic];
    }
    onUpdateProfile({
      ...profile,
      interests: updatedInterests,
    });
  };

  const setReadingPreference = (pref: "Quickest" | "Balanced" | "More detailed") => {
    onUpdateProfile({
      ...profile,
      readingPreference: pref,
    });
  };

  const toggleNotification = (key: keyof UserProfile["notifications"]) => {
    onUpdateProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key],
      },
    });
  };

  return (
    <div className="flex-1 bg-slate-50 px-4 py-6 space-y-6 overflow-y-auto" id="profile-container">
      
      {/* 1. Header Profile Banner */}
      <div className="bg-white p-5 rounded-3xl border border-sky-100/50 shadow-sm flex items-center gap-4 text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-tr from-sky-400 to-indigo-400 opacity-10 rounded-full blur-xl pointer-events-none"></div>
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-sm">
          B
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base font-black text-indigo-950 tracking-tight leading-none truncate" title={userEmail || "BLINK Reader"}>
            {userEmail || "BLINK Reader"}
          </h3>
          <p className="text-[10px] text-indigo-900/50 font-semibold truncate">
            {userEmail ? "Logged in via Supabase Auth" : "Personalized Feed Calibrator: Active"}
          </p>
          <div className="flex items-center gap-1 text-[8px] font-black text-sky-600 uppercase bg-sky-100/60 px-2.5 py-0.5 rounded-md w-fit">
            <Sparkles className="w-2.5 h-2.5 fill-current" /> Beta Access Verified
          </div>
          {isLoading && (
            <div className="text-[9px] font-bold text-amber-600 animate-pulse mt-1">
              Syncing with database...
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs font-semibold text-left">
          ⚠️ {error}
        </div>
      )}

      {/* 2. Reading Statistics (Point 4/5 surprise element) */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100/50 shadow-sm space-y-3.5 text-left">
        <div className="flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-sky-500" />
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Your Reading Statistics
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Read</span>
            <span className="text-lg font-black text-indigo-950">14 briefs</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Saved</span>
            <span className="text-lg font-black text-sky-600">~62 mins</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Streak</span>
            <span className="text-lg font-black text-purple-600">4 days</span>
          </div>
        </div>
      </div>

      {/* 3. Personal Interests / Followed Topics */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1 text-left">
          <ListFilter className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Followed Topics
          </h4>
        </div>
        <p className="text-xs text-indigo-900/50 font-semibold px-1 leading-snug text-left">
          Tap categories below to follow or unfollow them. BLINK prioritizes your feed weight accordingly.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TOPICS.map((topic) => {
            const isSelected = profile.interests.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleInterest(topic)}
                className={`p-3 rounded-2xl text-xs font-bold text-left transition-all duration-200 border flex items-center justify-between shadow-sm active:scale-95 ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-indigo-900/80 hover:border-sky-200"
                }`}
                id={`interest-toggle-${topic.toLowerCase()}`}
              >
                <span>{topic}</span>
                {isSelected && (
                  <div className="w-4.5 h-4.5 bg-sky-300 text-slate-900 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Reading Preferences */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5 px-1 text-left">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Reading Styles
          </h4>
        </div>
        <div className="bg-white rounded-3xl p-4.5 border border-sky-100/50 shadow-sm space-y-2 text-left">
          <p className="text-xs text-indigo-900/50 font-semibold leading-snug">
            Choose the length and level of detail inside your news cards:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {(["Quickest", "Balanced", "More detailed"] as const).map((pref) => {
              const isActive = profile.readingPreference === pref;
              return (
                <button
                  key={pref}
                  onClick={() => setReadingPreference(pref)}
                  className={`py-2 rounded-xl text-[9px] font-black uppercase text-center tracking-wider transition-all border ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-indigo-900/60 border-slate-200 hover:bg-slate-100"
                  }`}
                  id={`reading-pref-${pref.toLowerCase().replace(" ", "-")}`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Saved Stories embedded inside Screen 2 Dashboard (Points 2/4) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5 px-1 text-left">
          <Bookmark className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Saved Briefs ({savedStories.length})
          </h4>
        </div>

        {savedStories.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-sky-100/50 shadow-sm space-y-2">
            <p className="text-xs font-bold text-indigo-950/70">No saved summaries yet</p>
            <p className="text-[11px] text-slate-400">
              Saved stories will appear here for easy review and dashboard access.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedStories.map((story) => (
              <div
                key={`profile-saved-${story.id}`}
                className="bg-white rounded-2xl border border-sky-100/50 p-3 shadow-sm flex items-center justify-between gap-3 text-left cursor-pointer hover:border-sky-300"
                onClick={() => onOpenStoryDetail(story)}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest block">
                    {story.category}
                  </span>
                  <h4 className="text-xs font-bold text-indigo-950 leading-tight truncate">
                    {story.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 block">
                    {story.source} • {story.readTime}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSaved(story.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Notifications Alerts configuration */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5 px-1 text-left">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
            Alert Controls
          </h4>
        </div>
        <div className="bg-white rounded-3xl border border-sky-100/50 shadow-sm divide-y divide-slate-100">
          
          <div className="p-4 flex items-center justify-between text-left">
            <div>
              <span className="text-xs font-bold text-indigo-950 block">Breaking News alerts</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Only top bulletins</span>
            </div>
            <button
              onClick={() => toggleNotification("breakingNews")}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                profile.notifications.breakingNews ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow ${
                  profile.notifications.breakingNews ? "right-1" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="p-4 flex items-center justify-between text-left">
            <div>
              <span className="text-xs font-bold text-indigo-950 block">Daily Briefing reminder</span>
              <span className="text-[9px] text-slate-400 block leading-tight">☀️ Morning alerts</span>
            </div>
            <button
              onClick={() => toggleNotification("dailyBriefing")}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                profile.notifications.dailyBriefing ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow ${
                  profile.notifications.dailyBriefing ? "right-1" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="p-4 flex items-center justify-between text-left">
            <div>
              <span className="text-xs font-bold text-indigo-950 block">Topic updates</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Interest matched briefs</span>
            </div>
            <button
              onClick={() => toggleNotification("topicUpdates")}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                profile.notifications.topicUpdates ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow ${
                  profile.notifications.topicUpdates ? "right-1" : "left-1"
                }`}
              ></div>
            </button>
          </div>

        </div>
      </div>

      {/* 7. App settings & Security */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100/50 shadow-sm space-y-2.5 text-left">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-950">
            API Secret Manager
          </h4>
        </div>
        <p className="text-xs text-indigo-900/60 leading-relaxed font-semibold">
          This app utilizes client-safe AI gateways proxying to a full-stack Node backend. 
          To enable live Gemini-driven briefings, please add your <b>GEMINI_API_KEY</b> inside the <b>Settings &gt; Secrets</b> panel.
        </p>
      </div>

      {/* Log Out button */}
      <div className="pt-2 pb-6">
        <button
          onClick={onLogout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100/60 text-red-600 font-bold rounded-2xl transition text-xs tracking-wider uppercase border border-red-100 shadow-sm active:scale-98"
          id="logout-btn"
        >
          Log Out of Account
        </button>
      </div>

    </div>
  );
}
