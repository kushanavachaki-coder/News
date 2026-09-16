import Parser from "rss-parser";
import { RSS_SOURCES, RSSFeedSource } from "./rssConfig.js";
import { NewsStory } from "./types.js";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize RSS Parser with a 5-second timeout
const parser = new Parser({
  timeout: 5000,
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"]
    ]
  }
});

// Category Unsplash fallback images
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
  "World": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80",
  "Business": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "AI": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
  "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  "Science": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  "Biotechnology": "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=800&q=80",
  "Space": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  "Environment": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  "Entertainment": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  "Gaming": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
};

// Extractor for Image URLs from RSS feeds
function extractImageUrl(item: any, category: string): string {
  // 1. Check enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // 2. Check media:content custom parsed fields
  const mediaContent = item.mediaContent || item["media:content"];
  if (mediaContent) {
    if (typeof mediaContent === "object") {
      if (mediaContent.url) return mediaContent.url;
      if (mediaContent.$ && mediaContent.$.url) return mediaContent.$.url;
    }
    if (Array.isArray(mediaContent) && mediaContent.length > 0) {
      const first = mediaContent[0];
      if (first.url) return first.url;
      if (first.$ && first.$.url) return first.$.url;
    }
  }

  // 3. Check media:thumbnail
  const mediaThumbnail = item.mediaThumbnail || item["media:thumbnail"];
  if (mediaThumbnail) {
    if (typeof mediaThumbnail === "object") {
      if (mediaThumbnail.url) return mediaThumbnail.url;
      if (mediaThumbnail.$ && mediaThumbnail.$.url) return mediaThumbnail.$.url;
    }
    if (Array.isArray(mediaThumbnail) && mediaThumbnail.length > 0) {
      const first = mediaThumbnail[0];
      if (first.url) return first.url;
      if (first.$ && first.$.url) return first.$.url;
    }
  }

  // 4. Parse content or description for image tag
  const textToCheck = (item.content || "") + " " + (item.description || "") + " " + (item.contentSnippet || "");
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = textToCheck.match(imgRegex);
  if (match && match[1]) {
    const src = match[1];
    if (src.startsWith("http") && !src.includes("analytics") && !src.includes("doubleclick")) {
      return src;
    }
  }

  // 5. Fallback to high-quality Unsplash image for this category
  return CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES["World"];
}

// Normalize Date into "2h ago", "Yesterday", or clean relative strings
export function getRelativeTime(pubDateStr: string | undefined): string {
  if (!pubDateStr) return "Recently";
  try {
    const pubDate = new Date(pubDateStr);
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    
    if (isNaN(diffMs) || diffMs < 0) return "Recently";
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return diffMins <= 1 ? "Just now" : `${diffMins} min ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    // Fallback to absolute date
    return pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

// Generate simple hash to identify duplicates
function getTitleHash(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 80);
}

// Parse text description to remove raw HTML tags
function cleanHtml(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch and process live feeds
 */
export async function fetchLiveNews(): Promise<NewsStory[]> {
  const allStories: NewsStory[] = [];
  const processedHashes = new Map<string, NewsStory>();

  console.log(`Starting Live News Fetch from ${RSS_SOURCES.length} RSS sources...`);

  // Fetch concurrently in safe batches/groups
  const fetchPromises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      if (!feed || !feed.items) return;

      feed.items.forEach((item) => {
        if (!item.title) return;

        const title = item.title.trim();
        const originalUrl = item.link || "";
        const hash = getTitleHash(title);

        // De-duplication check
        if (processedHashes.has(hash)) {
          const existing = processedHashes.get(hash);
          if (existing && !existing.source.includes(source.publisher)) {
            // Append as multiple sources coverage
            existing.source = `${existing.source} & ${source.publisher}`;
          }
          return;
        }

        const rawContent = cleanHtml((item as any).content || (item as any).description || item.contentSnippet || "");
        const pubDate = item.pubDate || item.isoDate || new Date().toISOString();

        const parsedPubDate = pubDate ? new Date(pubDate) : new Date();
        const pubDateMs = isNaN(parsedPubDate.getTime()) ? Date.now() : parsedPubDate.getTime();

        // Standardize news item
        const story: NewsStory = {
          id: `live-${source.id}-${Math.random().toString(36).slice(2, 9)}`,
          category: source.category,
          title: title,
          summary: rawContent.slice(0, 240) + (rawContent.length > 240 ? "..." : ""),
          whyItMatters: "", // Loaded dynamically via Gemini
          source: source.publisher,
          publishedAt: getRelativeTime(pubDate),
          readTime: "45 sec read",
          imageUrl: extractImageUrl(item, source.category),
          fullContent: rawContent,
          isBreaking: false,
          originalUrl: originalUrl,
          keyPoints: [],
          whatHappened: rawContent.slice(0, 400),
          background: "",
          pubDateMs: pubDateMs
        };

        allStories.push(story);
        processedHashes.set(hash, story);
      });
    } catch (err) {
      console.error(`Failed to fetch RSS source [${source.id}] at ${source.url}:`, err);
    }
  });

  await Promise.all(fetchPromises);

  // Filter out any stale/empty items and sort chronological by actual publication timestamp, newest first
  const activeStories = allStories
    .filter(s => s.title.trim().length > 5 && s.fullContent && s.fullContent.length > 20)
    .sort((a, b) => {
      return (b.pubDateMs || 0) - (a.pubDateMs || 0);
    });

  console.log(`Live News Ingestion completed. Successfully normalized ${activeStories.length} de-duplicated news stories.`);
  return activeStories;
}

/**
 * Executes a Gemini function with automatic retries on 503 (Unavailable) and 429 (Too Many Requests) errors.
 * Includes exponential backoff and randomized jitter to prevent rate limit collisions.
 */
export async function callGeminiWithRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = String(error?.message || error?.status || error?.code || JSON.stringify(error) || error);
    const isTransient = 
      errorStr.includes("503") || 
      errorStr.includes("UNAVAILABLE") || 
      errorStr.includes("429") || 
      errorStr.includes("RESOURCE_EXHAUSTED") ||
      (error && (error.status === 503 || error.status === 429 || error.code === 503 || error.code === 429 || error.status === "UNAVAILABLE"));

    if (retries > 0 && isTransient) {
      // Exponential backoff + random jitter between 0% and 50%
      const jitter = Math.random() * 0.5 * delayMs;
      const backoffDelay = delayMs + jitter;
      console.warn(`[BLINK] Gemini API returned transient error (503/429/UNAVAILABLE). Retrying in ${Math.round(backoffDelay)}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return callGeminiWithRetry(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

/**
 * Summarize a story using Gemini on the server side
 */
export async function summarizeStoryWithGemini(
  ai: GoogleGenAI,
  story: NewsStory
): Promise<NewsStory> {
  const prompt = `
    You are BLINK's highly intelligent AI summaries engine designed for Gen-Z readers.
    Analyze the following live-fetched news article and generate a high-quality, factual summary.
    
    CRITICAL INSTRUCTION:
    - You MUST NOT hallucinate, invent, or make up facts, events, statistics, or quotes.
    - If the supplied article content does not contain details for "Why it matters" or "Key points", acknowledge the limitations clearly rather than inventing anything.
    - Base all statements STRICTLY on the details provided in the article title and content.
    
    ARTICLE TITLE: ${story.title}
    ARTICLE PUBLISHER: ${story.source}
    ARTICLE CONTENT: ${story.fullContent || story.summary}
    
    Provide your output in valid JSON matching this schema:
    {
      "summary": "Concise 30-60 second summary suited for quick consumption, clear and objective.",
      "whyItMatters": "Why this development matters to the general public or the industry.",
      "keyPoints": ["3 to 5 highly informative bullet points summarizing key details"],
      "estimatedReadingTime": "e.g., '30 sec read' or '45 sec read'",
      "isBreaking": true/false (Set to true ONLY if this represents highly disruptive, urgent breaking news reported within hours)
    }
  `;

  try {
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "30-60 second highly engaging Gen-Z summary." },
            whyItMatters: { type: Type.STRING, description: "Why this story matters to readers." },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 clear, informative key bullet points."
            },
            estimatedReadingTime: { type: Type.STRING, description: "Estimated read time, e.g. '30 sec read'." },
            isBreaking: { type: Type.BOOLEAN, description: "Whether this is active breaking news." }
          },
          required: ["summary", "whyItMatters", "keyPoints", "estimatedReadingTime", "isBreaking"]
        }
      }
    }));

    const data = JSON.parse(response.text || "{}");
    return {
      ...story,
      summary: data.summary || story.summary,
      whyItMatters: data.whyItMatters || `This update addresses reported developments in the ${story.category} category.`,
      keyPoints: data.keyPoints && data.keyPoints.length > 0 ? data.keyPoints : [story.summary],
      readTime: data.estimatedReadingTime || story.readTime,
      isBreaking: data.isBreaking !== undefined ? data.isBreaking : story.isBreaking,
      whatHappened: data.summary || story.summary,
      background: story.background || "AI-generated background context is temporarily unavailable."
    };
  } catch (err) {
    console.error(`Gemini summary generation failed for story: "${story.title}":`, err);
    // Return story with high-quality fallback values on failure (grounded in the real RSS content only)
    return {
      ...story,
      whyItMatters: "AI-generated significance analysis is temporarily offline.",
      keyPoints: [
        "AI key points extraction is temporarily offline.",
        story.summary || "No description provided."
      ],
      background: `Ingested in real-time from the public feed of ${story.source}. AI context is currently unavailable.`
    };
  }
}
