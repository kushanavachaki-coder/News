import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Compass,
  Zap,
  Bookmark,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  BookOpen,
  X,
  Search,
  BookMarked
} from "lucide-react";

import { NewsStory, TrendingTopic, UserProfile } from "./types";
import { INITIAL_STORIES, TRENDING_TOPICS, WHAT_YOU_MISSED_STORIES } from "./newsData";

// Modular Components
import Header from "./components/Header";
import DailyBriefing from "./components/DailyBriefing";
import TrendingNow from "./components/TrendingNow";
import Blink60 from "./components/Blink60";
import ExplainDrawer from "./components/ExplainDrawer";
import AskAIDrawer from "./components/AskAIDrawer";
import StoryDetail from "./components/StoryDetail";
import ProfileView from "./components/ProfileView";

const CATEGORIES = [
  "For You",
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

const DAILY_QUOTES = [
  "Did you know? Scanning a BLINK summary saves an average of 4 minutes per story! ⏱",
  "Consistency is key. 3 minutes of BLINK daily keeps you completely in the loop. ⚡",
  "The average news article is 800 words. BLINK boils it down to 60 essential words. 🧠",
  "Read less, understand more. Discover, understand, and move on! ✨",
  "Knowledge is power. Have a wonderful and productive day ahead! ☀️"
];

export default function App() {
  // Navigation & Tab States
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "blink60" | "saved" | "profile">("home");
  const [activeCategory, setActiveCategory] = useState("For You");
  
  // Data State
  const [stories, setStories] = useState<NewsStory[]>(() => {
    const cached = localStorage.getItem("blink_cached_real_news");
    return cached ? JSON.parse(cached) : [];
  });
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(TRENDING_TOPICS);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [liveNewsUnavailable, setLiveNewsUnavailable] = useState(() => {
    const cached = localStorage.getItem("blink_cached_real_news");
    return !cached;
  });

  // Daily Quote Selection
  const [dailyQuote, setDailyQuote] = useState(() => {
    return DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length];
  });

  // Bookmark / Saved State
  const [savedStoryIds, setSavedStoryIds] = useState<string[]>(() => {
    const cached = localStorage.getItem("blink_saved_stories");
    return cached ? JSON.parse(cached) : [];
  });

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem("blink_user_profile");
    if (cached) return JSON.parse(cached);
    return {
      interests: ["AI", "Technology", "Space", "Business"],
      readingPreference: "Balanced",
      notifications: {
        breakingNews: true,
        dailyBriefing: true,
        topicUpdates: false,
        sportsUpdates: false,
        techUpdates: true
      }
    };
  });

  // Search & Recent searches
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const cached = localStorage.getItem("blink_recent_searches");
    return cached ? JSON.parse(cached) : ["AI models", "Space Ocean", "India budget"];
  });

  // Overlay state controllers
  const [selectedStoryToExplain, setSelectedStoryToExplain] = useState<NewsStory | null>(null);
  const [selectedStoryToChat, setSelectedStoryToChat] = useState<NewsStory | null>(null);
  const [selectedStoryDetail, setSelectedStoryDetail] = useState<NewsStory | null>(null);

  // Synced Caching Effects
  useEffect(() => {
    localStorage.setItem("blink_saved_stories", JSON.stringify(savedStoryIds));
  }, [savedStoryIds]);

  useEffect(() => {
    localStorage.setItem("blink_user_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("blink_recent_searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Fetch stories on startup
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("API request failed.");
        return res.json();
      })
      .then((data) => {
        if (data.stories && data.stories.length > 0) {
          setStories(data.stories);
          localStorage.setItem("blink_cached_real_news", JSON.stringify(data.stories));
          setLiveNewsUnavailable(false);
        } else {
          throw new Error("No live stories returned.");
        }
        if (data.trendingTopics) {
          setTrendingTopics(data.trendingTopics);
        }
      })
      .catch((err) => {
        console.error("Live news API error:", err);
        const cached = localStorage.getItem("blink_cached_real_news");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            setStories(parsed);
            setLiveNewsUnavailable(false);
            return;
          }
        }
        setLiveNewsUnavailable(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Personalized feed sorting algorithm
  const getPersonalizedStories = () => {
    if (activeCategory !== "For You") {
      return stories.filter(
        (story) => story.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    const preferredCategories = profile.interests.map((i) => i.toLowerCase());
    
    const preferredStories = stories.filter((story) =>
      preferredCategories.includes(story.category.toLowerCase())
    );
    const otherStories = stories.filter(
      (story) => !preferredCategories.includes(story.category.toLowerCase())
    );

    const personalizedFeed: NewsStory[] = [];
    let prefIndex = 0;
    let otherIndex = 0;

    while (prefIndex < preferredStories.length || otherIndex < otherStories.length) {
      for (let i = 0; i < 2; i++) {
        if (prefIndex < preferredStories.length) {
          personalizedFeed.push(preferredStories[prefIndex++]);
        }
      }
      if (otherIndex < otherStories.length) {
        personalizedFeed.push(otherStories[otherIndex++]);
      }
    }

    return personalizedFeed.length > 0 ? personalizedFeed : stories;
  };

  const handleToggleSave = (storyId: string) => {
    if (savedStoryIds.includes(storyId)) {
      setSavedStoryIds((prev) => prev.filter((id) => id !== storyId));
    } else {
      setSavedStoryIds((prev) => [...prev, storyId]);
    }
  };

  const handleSelectStoryDetail = (story: NewsStory) => {
    setSelectedStoryDetail(story);
    
    // Check if we need to fetch an AI summary dynamically
    if (!story.whyItMatters || story.whyItMatters.trim() === "") {
      fetch("/api/story/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: story.id, story: story })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Summarization failed");
          return res.json();
        })
        .then((data) => {
          if (data.story) {
            // Update the state of stories so we persist the summary in the active session
            setStories((prev) => prev.map((s) => s.id === story.id ? data.story : s));
            // Update the selectedStoryDetail to the summarized version!
            setSelectedStoryDetail(data.story);
          }
        })
        .catch((err) => {
          console.error("Failed to dynamically summarize:", err);
        });
    }
  };

  const handleTopicClick = (topicName: string) => {
    setActiveCategory(topicName);
    setActiveTab("home");
    setSelectedStoryDetail(null);
  };

  const handleAddSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (!recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [trimmed, ...prev.slice(0, 4)]);
    }
    setSearchQuery(trimmed);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Filtered stories for search inside Explore Tab
  const filteredStories = stories.filter((story) => {
    const query = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(query) ||
      story.summary.toLowerCase().includes(query) ||
      story.category.toLowerCase().includes(query) ||
      story.source.toLowerCase().includes(query)
    );
  });

  // Filtered saved stories for Saved Tab
  const [savedSearchQuery, setSavedSearchQuery] = useState("");
  const bookmarkedStories = stories.filter((story) => savedStoryIds.includes(story.id));
  const filteredSavedStories = bookmarkedStories.filter((story) => {
    const q = savedSearchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(q) ||
      story.summary.toLowerCase().includes(q) ||
      story.category.toLowerCase().includes(q)
    );
  });

  // Personalized small recommendations: "Because you read X" (Point 5)
  const getPersonalizedRecommendations = () => {
    const topInterest = profile.interests[0] || "AI";
    const recommended = stories.filter(
      (story) => story.category.toLowerCase() === topInterest.toLowerCase()
    );
    return {
      category: topInterest,
      stories: recommended.slice(0, 2)
    };
  };

  const recommendationInfo = getPersonalizedRecommendations();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-indigo-950 font-sans" id="app-root">
      
      {/* Centered phone mockup frame with Light Background & Soft Shadows */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 shadow-2xl relative border-x border-sky-100/40 flex flex-col pb-20 overflow-x-hidden">
        
        {/* Sticky top brand header with automated eye blink */}
        {!selectedStoryDetail && (
          <Header
            onSearchClick={() => {
              setActiveTab("explore");
              setSelectedStoryDetail(null);
            }}
            onProfileClick={() => {
              setActiveTab("profile");
              setSelectedStoryDetail(null);
            }}
            onLogoClick={() => {
              setActiveTab("home");
              setActiveCategory("For You");
              setSelectedStoryDetail(null);
            }}
            activeTab={activeTab}
          />
        )}

        {isDemoMode && (
          <div className="bg-amber-50 border-y border-amber-100 text-amber-800 text-[10px] font-bold px-4 py-2 flex items-center justify-between shrink-0" id="demo-mode-banner">
            <span>⚡ DEMO MODE ACTIVE — Fictional Sample Stories</span>
            <button 
              onClick={() => {
                setIsDemoMode(false);
                setLiveNewsUnavailable(true);
                setStories([]);
              }}
              className="underline hover:text-amber-950 font-extrabold"
            >
              Exit
            </button>
          </div>
        )}

        {/* ----------------- APP TABS ROUTER ----------------- */}

        {liveNewsUnavailable && !isDemoMode ? (
          <div className="flex-1 flex flex-col p-6 justify-center items-center text-center space-y-6" id="offline-screen">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 text-indigo-500 animate-pulse">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-indigo-950">Live News Temporarily Offline</h2>
              <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                We are currently unable to fetch real-time news. Please check back shortly, or activate demo mode to test features with fictional sample data.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  setIsDemoMode(true);
                  setLiveNewsUnavailable(false);
                  setStories(INITIAL_STORIES);
                  setTrendingTopics(TRENDING_TOPICS);
                }}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all text-sm tracking-wide"
                id="activate-demo-btn"
              >
                Activate Demo Mode
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  fetch("/api/news")
                    .then((res) => {
                      if (!res.ok) throw new Error("Unavailable");
                      return res.json();
                    })
                    .then((data) => {
                      if (data.stories && data.stories.length > 0) {
                        setStories(data.stories);
                        localStorage.setItem("blink_cached_real_news", JSON.stringify(data.stories));
                        setLiveNewsUnavailable(false);
                      }
                    })
                    .catch(() => setLiveNewsUnavailable(true))
                    .finally(() => setIsLoading(false));
                }}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-950/70 font-bold rounded-2xl transition text-sm"
                id="retry-connection-btn"
              >
                {isLoading ? "Reconnecting..." : "Retry Connection"}
              </button>
            </div>
          </div>
        ) : selectedStoryDetail ? (
          /* IMPILED IMPLICIT DETAIL REPLACEMENT (Preserving Detail flow) */
          <StoryDetail
            story={selectedStoryDetail}
            onBack={() => setSelectedStoryDetail(null)}
            isSaved={savedStoryIds.includes(selectedStoryDetail.id)}
            onToggleSave={() => handleToggleSave(selectedStoryDetail.id)}
            onOpenExplain={() => setSelectedStoryToExplain(selectedStoryDetail)}
            onOpenChat={() => setSelectedStoryToChat(selectedStoryDetail)}
          />
        ) : (
          <div className="flex-1 flex flex-col">

            {/* SCREEN 1: HOME FEED TAB */}
            {activeTab === "home" && (
              <div className="flex-1 flex flex-col p-4 space-y-6">
                
                {/* Horizontal Category Pill scrollbar (Navy selection, white cards) */}
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none shrink-0 -mx-4 px-4">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4.5 py-2 rounded-full text-xs font-black tracking-wide whitespace-nowrap transition border ${
                          isActive
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                            : "bg-white text-indigo-900/70 border-sky-100/50 hover:bg-slate-50"
                        }`}
                        id={`category-pill-${cat.toLowerCase().replace(" ", "-")}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Friendly greetings & Daily Quote panel (Point 5) */}
                <div className="bg-white rounded-3xl p-5 border border-sky-100/50 shadow-sm text-left space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block">
                    ⚡ Daily digest fact
                  </span>
                  <p className="text-sm font-semibold text-indigo-950/90 leading-relaxed italic">
                    "{dailyQuote}"
                  </p>
                </div>

                {/* Daily Briefing component (Snapchat-style story highlights) */}
                {activeCategory === "For You" && (
                  <DailyBriefing
                    stories={stories}
                    onOpenStory={(story) => setSelectedStoryDetail(story)}
                  />
                )}

                {/* News card highlights list based on active selected category */}
                <div className="space-y-6" id="news-feed-cards">
                  <div className="flex items-center justify-between border-b border-sky-100/50 pb-2 text-left">
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                      Feed: {activeCategory}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {getPersonalizedStories().length} stories
                    </span>
                  </div>

                  {getPersonalizedStories().map((story, index) => {
                    const isBookmarked = savedStoryIds.includes(story.id);

                    // ==================== 1. FEATURED CARD (Index 0) ====================
                    if (index === 0) {
                      return (
                        <div
                          key={story.id}
                          className="rounded-3xl bg-white border border-sky-100/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-left relative flex flex-col group cursor-pointer"
                          id={`news-card-${story.id}`}
                          onClick={() => setSelectedStoryDetail(story)}
                        >
                          {/* Image backdrop container */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                              loading="lazy"
                            />
                            {story.isBreaking && (
                              <span className="absolute top-3.5 left-3.5 bg-rose-500 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full tracking-widest shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                🔴 BREAKING
                              </span>
                            )}
                            <span className="absolute bottom-3.5 left-3.5 bg-indigo-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md">
                              ⭐ FEATURED • {story.category}
                            </span>
                          </div>

                          {/* Copy Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-lg font-black text-indigo-950 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors duration-200">
                                {story.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                {story.summary}
                              </p>
                            </div>

                            {/* Why it matters widget */}
                            {story.whyItMatters && (
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-0.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                                  Why it matters
                                </span>
                                <p className="text-xs text-indigo-950/80 font-bold leading-relaxed">
                                  {story.whyItMatters}
                                </p>
                              </div>
                            )}

                            {/* Footer options */}
                            <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs text-slate-400">
                              <div className="flex flex-col">
                                <span className="font-bold text-indigo-950">
                                  {story.source}
                                </span>
                                <span>{story.publishedAt} • ⏱ {story.readTime}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSave(story.id);
                                  }}
                                  className={`p-2 rounded-xl border transition ${
                                    isBookmarked
                                      ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                                      : "bg-white border-slate-200 text-indigo-600 hover:bg-sky-50"
                                  }`}
                                  aria-label="Bookmark story"
                                >
                                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStoryToExplain(story);
                                  }}
                                  className="p-2 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-sky-50 text-indigo-950/70 transition flex items-center gap-1"
                                >
                                  <HelpCircle className="w-4 h-4 text-sky-500" />
                                  <span className="text-[9px] font-black uppercase tracking-widest px-0.5">Explain</span>
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectStoryDetail(story);
                              }}
                              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 transition active:scale-95"
                            >
                              Read full summary <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // ==================== 2. REGULAR CARD (Index 1) ====================
                    if (index === 1) {
                      return (
                        <div
                          key={story.id}
                          className="rounded-3xl bg-white border border-sky-100/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-left relative flex flex-col group cursor-pointer"
                          id={`news-card-${story.id}`}
                          onClick={() => handleSelectStoryDetail(story)}
                        >
                          {/* Sliced Image Container for Medium scale */}
                          <div className="relative h-40 w-full overflow-hidden bg-slate-50">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                              loading="lazy"
                            />
                            <span className="absolute bottom-3.5 left-3.5 bg-indigo-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md">
                              {story.category}
                            </span>
                          </div>

                          <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <h3 className="text-base font-black text-indigo-950 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors duration-200">
                                {story.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 leading-normal line-clamp-2">
                                {story.summary}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-400">
                              <div className="flex flex-col text-[11px]">
                                <span className="font-bold text-indigo-950">
                                  {story.source}
                                </span>
                                <span>{story.publishedAt} • {story.readTime}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSave(story.id);
                                  }}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isBookmarked
                                      ? "bg-sky-500 border-sky-500 text-white"
                                      : "bg-white border-slate-200 text-indigo-600 hover:bg-sky-50"
                                  }`}
                                  aria-label="Bookmark story"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // ==================== 3. QUICK CARD LISTING (Index >= 2) ====================
                    return (
                      <div
                        key={story.id}
                        className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-sky-100/40 shadow-sm flex gap-3 cursor-pointer transition-all duration-300 text-left items-center justify-between group"
                        id={`news-card-quick-${story.id}`}
                        onClick={() => handleSelectStoryDetail(story)}
                      >
                        <div className="space-y-1 min-w-0 flex-1 pr-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">
                              {story.category}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold">
                              • {story.publishedAt}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-indigo-950 leading-snug group-hover:text-indigo-600 line-clamp-2 transition-colors duration-200">
                            {story.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold block">
                            {story.source} • ⏱ {story.readTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSave(story.id);
                            }}
                            className={`p-1.5 rounded-lg border transition shrink-0 ${
                              isBookmarked
                                ? "bg-sky-500 border-sky-500 text-white"
                                : "bg-white border-slate-200 text-indigo-600 hover:bg-sky-50"
                            }`}
                            aria-label="Bookmark story"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* SCREEN: EXPLORE TAB (Trending now + Small Recommendations + Power Search) */}
            {activeTab === "explore" && (
              <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
                
                <div className="text-left space-y-1">
                  <h2 className="text-3xl font-black text-indigo-950 tracking-tight leading-none">
                    🧭 Explore Feed
                  </h2>
                  <p className="text-sm text-slate-500 leading-snug">
                    Trending stories, power searching, and custom picks.
                  </p>
                </div>

                {/* Power Search bar */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search keywords, events, countries..."
                      className="w-full pl-11 pr-4.5 py-3 border border-sky-100 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm text-indigo-950"
                    />
                    <Search className="w-4.5 h-4.5 text-indigo-400 absolute left-4 top-3.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-1 absolute right-3.5 top-3 text-slate-400 hover:text-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Topics / Companies / People dynamic buttons (Spotlight tags) */}
                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                    ⚡ Spotlight tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Gemini 3", "Europa", "Nvidia", "Semiconductor", "Climate Change", "Cricket World Cup"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddSearch(tag)}
                        className="px-3.5 py-1.5 rounded-full bg-white text-[11px] font-bold text-indigo-900/80 border border-sky-100/60 shadow-sm hover:border-sky-300 active:scale-95 transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches panel */}
                {recentSearches.length > 0 && !searchQuery && (
                  <div className="space-y-2 text-left px-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>RECENT KEYWORDS</span>
                      <button
                        onClick={handleClearRecentSearches}
                        className="hover:text-red-500 uppercase tracking-wider"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleAddSearch(term)}
                          className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-indigo-900/80 border border-slate-200/40 transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending section */}
                {!searchQuery && (
                  <TrendingNow
                    topics={trendingTopics}
                    onTopicSelect={handleTopicClick}
                  />
                )}

                {/* Surprise Element: "Because you read X" (Point 5) */}
                {recommendationInfo.stories.length > 0 && !searchQuery && (
                  <div className="space-y-3 animate-fade-in text-left" id="because-you-read-section">
                    <div className="px-1">
                      <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        ✨ Calibrated recommendation
                      </span>
                      <h3 className="text-base font-black text-indigo-950 mt-1.5">
                        Because you read {recommendationInfo.category}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {recommendationInfo.stories.map((recStory) => (
                        <div
                          key={`rec-${recStory.id}`}
                          onClick={() => setSelectedStoryDetail(recStory)}
                          className="bg-white p-3.5 rounded-2xl border border-sky-100/50 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-sky-300 transition-all duration-200"
                        >
                          <div className="flex-1 text-left space-y-1 min-w-0">
                            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">
                              {recStory.category}
                            </span>
                            <h4 className="text-xs font-bold text-indigo-950 leading-snug truncate">
                              {recStory.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 font-semibold">
                              {recStory.summary}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={recStory.imageUrl}
                              alt={recStory.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories & Topics Grid - Android App shortcut Style */}
                {!searchQuery && (
                  <div className="space-y-3.5 text-left">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                      📁 Categories & topics
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "India", bg: "from-orange-50 to-amber-50/50", border: "border-orange-100/60", icon: "🇮🇳" },
                        { name: "World", bg: "from-blue-50 to-sky-50/50", border: "border-blue-100/60", icon: "🌐" },
                        { name: "Business", bg: "from-emerald-50 to-teal-50/50", border: "border-emerald-100/60", icon: "📈" },
                        { name: "Technology", bg: "from-purple-50 to-indigo-50/50", border: "border-purple-100/60", icon: "💻" },
                        { name: "AI", bg: "from-indigo-50 to-violet-50/50", border: "border-indigo-100/60", icon: "🤖" },
                        { name: "Sports", bg: "from-rose-50 to-red-50/50", border: "border-rose-100/60", icon: "🏆" },
                        { name: "Science", bg: "from-cyan-50 to-teal-50/50", border: "border-cyan-100/60", icon: "🔬" },
                        { name: "Space", bg: "from-slate-100 to-indigo-100/30", border: "border-slate-200", icon: "🚀" },
                        { name: "Environment", bg: "from-green-50 to-emerald-50/50", border: "border-green-100/60", icon: "🌱" },
                        { name: "Entertainment", bg: "from-fuchsia-50 to-pink-50/50", border: "border-fuchsia-100/60", icon: "🎬" }
                      ].map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => handleTopicClick(cat.name)}
                          className={`p-4 rounded-2xl bg-gradient-to-tr ${cat.bg} border ${cat.border} text-left flex flex-col justify-between h-24 shadow-sm hover:shadow active:scale-95 transition-all duration-200 group`}
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                          <div>
                            <h4 className="text-xs font-black text-indigo-950">
                              {cat.name}
                            </h4>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
                              View feed
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter results block */}
                <div className="space-y-3.5 text-left pt-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block border-b border-sky-100/50 pb-1.5">
                    {searchQuery ? `SEARCH RESULTS FOR "${searchQuery}"` : "Popular spotlight stories"}
                  </span>

                  {searchQuery && filteredStories.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-1 bg-white rounded-3xl p-6 border border-sky-100/40 shadow-sm">
                      <p className="font-bold">No briefings found</p>
                      <p className="text-xs font-semibold">Try searching other categories or standard keywords.</p>
                    </div>
                  ) : (
                    (searchQuery ? filteredStories : stories.slice(0, 4)).map((story) => (
                      <div
                        key={`search-${story.id}`}
                        onClick={() => handleSelectStoryDetail(story)}
                        className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-sky-100/40 shadow-sm flex gap-3 cursor-pointer transition-all duration-300"
                      >
                        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">
                              {story.category}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold">
                              • {story.publishedAt}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-indigo-950 leading-snug line-clamp-1">
                            {story.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 font-semibold">
                            {story.summary}
                          </p>
                          <span className="text-[9px] text-indigo-300 font-bold block">
                            {story.source} • {story.readTime}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* SCREEN: BLINK 60 Vertical Immersive Stories Feed */}
            {activeTab === "blink60" && (
              <Blink60
                stories={stories}
                savedStories={savedStoryIds}
                onToggleSave={handleToggleSave}
                onOpenExplain={(story) => setSelectedStoryToExplain(story)}
                onOpenChat={(story) => setSelectedStoryToChat(story)}
                onOpenStoryDetail={(story) => handleSelectStoryDetail(story)}
              />
            )}

            {/* SCREEN: SAVED STORIES LIST TAB */}
            {activeTab === "saved" && (
              <div className="flex-1 flex flex-col p-4 space-y-6">
                
                <div className="text-left space-y-1">
                  <h2 className="text-3xl font-black text-indigo-950 tracking-tight leading-none">
                    🔖 Saved Briefs
                  </h2>
                  <p className="text-sm text-slate-500 leading-snug">
                    Your customized local reference library.
                  </p>
                </div>

                {bookmarkedStories.length > 0 && (
                  <input
                    type="text"
                    value={savedSearchQuery}
                    onChange={(e) => setSavedSearchQuery(e.target.value)}
                    placeholder="Search your saved bookmarked briefs..."
                    className="w-full px-4.5 py-3 border border-sky-100 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                )}

                {filteredSavedStories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white rounded-3xl p-6 border border-sky-100/50 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center">
                      <Bookmark className="w-6 h-6 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-indigo-950">
                        {bookmarkedStories.length === 0 ? "Bookmark library is empty" : "No results match search"}
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                        {bookmarkedStories.length === 0
                          ? "Scan stories on the Home feed and hit bookmark to collect summaries here for quick offline scans."
                          : "Try resetting your search filter words."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredSavedStories.map((savedStory) => (
                      <div
                        key={`saved-tab-${savedStory.id}`}
                        onClick={() => handleSelectStoryDetail(savedStory)}
                        className="bg-white rounded-2xl border border-sky-100/40 p-4 shadow-sm flex items-center justify-between gap-4 text-left cursor-pointer hover:border-sky-300 relative group transition-all"
                      >
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={savedStory.imageUrl}
                            alt={savedStory.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-0.5 min-w-0 pr-6">
                          <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest block">
                            {savedStory.category}
                          </span>
                          <h4 className="text-xs font-bold text-indigo-950 leading-snug truncate">
                            {savedStory.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 block">
                            {savedStory.source} • {savedStory.readTime}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(savedStory.id);
                          }}
                          className="absolute right-4 top-4.5 text-slate-300 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* SCREEN 2: PROFILE / DASHBOARD EXPERIENCE */}
            {activeTab === "profile" && (
              <ProfileView
                profile={profile}
                onUpdateProfile={setProfile}
                savedStories={bookmarkedStories}
                onRemoveSaved={handleToggleSave}
                onOpenStoryDetail={(story) => handleSelectStoryDetail(story)}
              />
            )}

          </div>
        )}

        {/* ----------------- persistent bottom navigation menu ----------------- */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-sky-100/80 py-2 px-3 flex items-center justify-between z-30 shadow-lg">
          <div className="flex w-full justify-between items-center max-w-sm mx-auto">
            
            {/* Home tab button */}
            <button
              onClick={() => {
                setActiveTab("home");
                setSelectedStoryDetail(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1.5 flex-1 relative transition ${
                activeTab === "home" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-btn-home"
            >
              <HomeIcon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Home</span>
              {activeTab === "home" && (
                <div className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

            {/* Explore tab button */}
            <button
              onClick={() => {
                setActiveTab("explore");
                setSelectedStoryDetail(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1.5 flex-1 relative transition ${
                activeTab === "explore" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-btn-explore"
            >
              <Compass className="w-4.5 h-4.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Explore</span>
              {activeTab === "explore" && (
                <div className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

            {/* Distinctive Distinctive Center distinctive BLINK 60 tab button (Point 3) */}
            <button
              onClick={() => {
                setActiveTab("blink60");
                setSelectedStoryDetail(null);
              }}
              className={`flex flex-col items-center justify-center -translate-y-3.5 w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 text-white shadow-lg active:scale-95 transition-all relative group shrink-0 ${
                activeTab === "blink60" ? "ring-4 ring-indigo-100" : "animate-[pulse_3.5s_infinite]"
              }`}
              id="tab-btn-blink60"
            >
              <Zap className={`w-6 h-6 ${activeTab === "blink60" ? "fill-current animate-pulse" : "group-hover:scale-110"}`} />
              <span className="absolute bottom-2.5 text-[6.5px] font-black tracking-widest uppercase">BLINK</span>
            </button>

            {/* Saved tab button */}
            <button
              onClick={() => {
                setActiveTab("saved");
                setSelectedStoryDetail(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1.5 flex-1 relative transition ${
                activeTab === "saved" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-btn-saved"
            >
              <Bookmark className={`w-4.5 h-4.5 ${activeTab === "saved" ? "fill-current" : ""}`} />
              <span className="text-[9px] font-black uppercase tracking-wider">Saved</span>
              {activeTab === "saved" && (
                <div className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

            {/* Profile dashboard tab button */}
            <button
              onClick={() => {
                setActiveTab("profile");
                setSelectedStoryDetail(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1.5 flex-1 relative transition ${
                activeTab === "profile" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              id="tab-btn-profile"
            >
              <User className="w-4.5 h-4.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Profile</span>
              {activeTab === "profile" && (
                <div className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

          </div>
        </nav>

        {/* ----------------- AI BACKEND OVERLAYS ----------------- */}

        {/* Explain drawer */}
        <ExplainDrawer
          story={selectedStoryToExplain}
          onClose={() => setSelectedStoryToExplain(null)}
        />

        {/* Chat Drawer */}
        <AskAIDrawer
          story={selectedStoryToChat}
          onClose={() => setSelectedStoryToChat(null)}
        />

      </div>
    </div>
  );
}
