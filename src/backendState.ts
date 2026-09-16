import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_STORIES, TRENDING_TOPICS } from "./newsData";
import { fetchLiveNews, summarizeStoryWithGemini } from "./rssProcessor";
import { NewsStory } from "./types";

// Load environment variables conditionally
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// In-memory cache for live fetched news
export let LIVE_STORIES_CACHE: NewsStory[] = [];
export let IS_FETCHING_FEEDS = false;

// Lazy-initialize Gemini SDK to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Update live news cache
export async function updateLiveNewsCache() {
  if (IS_FETCHING_FEEDS) return;
  IS_FETCHING_FEEDS = true;
  console.log("[BLINK] Fetching live news from RSS feeds...");
  try {
    const liveStories = await fetchLiveNews();
    if (liveStories && liveStories.length > 0) {
      // Merge live stories with existing cached ones to preserve any already-generated summaries
      const updatedCache: NewsStory[] = [];
      const existingMap = new Map(LIVE_STORIES_CACHE.map((s) => [s.title, s]));

      for (const story of liveStories) {
        const existing = existingMap.get(story.title);
        if (existing && existing.whyItMatters && existing.whyItMatters.trim() !== "") {
          updatedCache.push(existing);
        } else {
          updatedCache.push(story);
        }
      }

      LIVE_STORIES_CACHE = updatedCache;
      console.log(`[BLINK] Cache updated. Total live stories: ${LIVE_STORIES_CACHE.length}`);
    }
  } catch (err) {
    console.error("[BLINK] Error during background live feed fetch:", err);
  } finally {
    IS_FETCHING_FEEDS = false;
  }
}

// Helper to extract dynamic trending topics from stories cache
export function getDynamicTrendingTopics(stories: NewsStory[]): any[] {
  const usedCategories = new Set<string>();
  const trending: any[] = [];
  let position = 1;

  for (const story of stories) {
    if (trending.length >= 5) break;
    if (!usedCategories.has(story.category)) {
      usedCategories.add(story.category);
      trending.push({
        id: `trend-${story.id}`,
        topic: story.category,
        position: position++,
        label: story.title.length > 30 ? story.title.slice(0, 30) + "..." : story.title,
        imageUrl: story.imageUrl,
      });
    }
  }

  // Fallback to initial topics if needed
  if (trending.length < 5) {
    const existingTopics = TRENDING_TOPICS;
    for (const topic of existingTopics) {
      if (trending.length >= 5) break;
      if (!trending.some((t) => t.topic === topic.topic)) {
        trending.push({
          ...topic,
          position: position++,
        });
      }
    }
  }

  return trending;
}
