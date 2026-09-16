import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_STORIES, TRENDING_TOPICS } from "./src/newsData.js";
import { fetchLiveNews, summarizeStoryWithGemini, callGeminiWithRetry } from "./src/rssProcessor";
import { RSS_SOURCES } from "./src/rssConfig";
import { NewsStory } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for live fetched news
let LIVE_STORIES_CACHE: NewsStory[] = [];
let IS_FETCHING_FEEDS = false;

// Lazy-initialize Gemini SDK to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
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

// Background Task: Periodic live news cache updates
async function updateLiveNewsCache() {
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

      // Background Pre-summarization of the first 5 stories for the Daily Briefing
      const ai = getAiClient();
      if (ai) {
        const briefingStories = LIVE_STORIES_CACHE.slice(0, 5);
        console.log(`[BLINK] Starting background pre-summarization for top ${briefingStories.length} Daily Briefing stories...`);

        for (const story of briefingStories) {
          if (!story.whyItMatters || story.whyItMatters.trim() === "") {
            try {
              // Add a generous 3.5 second spacing delay to prevent hitting concurrent Gemini rate-limits
              await new Promise((resolve) => setTimeout(resolve, 3500));
              const summarized = await summarizeStoryWithGemini(ai, story);
              const idx = LIVE_STORIES_CACHE.findIndex((s) => s.id === story.id);
              if (idx !== -1) {
                LIVE_STORIES_CACHE[idx] = summarized;
                console.log(`[BLINK] Pre-summarized briefing story: "${story.title}"`);
              }
            } catch (sumErr) {
              console.error(`[BLINK] Failed pre-summarizing story "${story.title}":`, sumErr);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("[BLINK] Error during background live feed fetch:", err);
  } finally {
    IS_FETCHING_FEEDS = false;
  }
}

// Start initial feed fetch at startup
updateLiveNewsCache();

// Poll every 15 minutes for new articles
setInterval(updateLiveNewsCache, 15 * 60 * 1000);

// Helper to extract dynamic trending topics from stories cache
function getDynamicTrendingTopics(stories: NewsStory[]): any[] {
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

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: !!getAiClient(),
    liveStoriesCount: LIVE_STORIES_CACHE.length,
    fetchingFeeds: IS_FETCHING_FEEDS,
  });
});

// Force refresh news
app.post("/api/news/refresh", async (req, res) => {
  console.log("[BLINK] Manual refresh triggered from UI...");
  await updateLiveNewsCache();
  res.json({
    success: true,
    liveStoriesCount: LIVE_STORIES_CACHE.length,
  });
});

// Get all news stories & trending topics
app.get("/api/news", async (req, res) => {
  // If cache is empty, try to fetch immediately
  if (LIVE_STORIES_CACHE.length === 0 && !IS_FETCHING_FEEDS) {
    await updateLiveNewsCache();
  }

  const storiesToReturn = LIVE_STORIES_CACHE.length > 0 ? LIVE_STORIES_CACHE : INITIAL_STORIES;
  const trending = getDynamicTrendingTopics(storiesToReturn);

  res.json({
    stories: storiesToReturn,
    trendingTopics: trending,
  });
});

// Dynamically summarize a story on-demand
app.post("/api/story/summarize", async (req, res) => {
  const { storyId } = req.body;
  if (!storyId) {
    return res.status(400).json({ error: "storyId is required" });
  }

  // Find story
  let story = LIVE_STORIES_CACHE.find((s) => s.id === storyId);
  if (!story) {
    story = INITIAL_STORIES.find((s) => s.id === storyId);
  }

  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }

  // If already summarized, return immediately
  if (story.whyItMatters && story.whyItMatters.trim() !== "") {
    return res.json({ story });
  }

  const ai = getAiClient();
  if (!ai) {
    // Return high-quality local fallbacks if Gemini is not configured
    story.whyItMatters = "This live news event highlights critical developments within this category.";
    story.keyPoints = [
      "Major report published by trusted publishers.",
      "Details ongoing developments and changes affecting this category.",
      "Reflects immediate real-world impacts."
    ];
    story.background = `This story was ingested in real-time from our centralized public feed provided by ${story.source}.`;
    return res.json({ story });
  }

  try {
    const summarized = await summarizeStoryWithGemini(ai, story);
    // Update story in caches
    const liveIdx = LIVE_STORIES_CACHE.findIndex((s) => s.id === storyId);
    if (liveIdx !== -1) {
      LIVE_STORIES_CACHE[liveIdx] = summarized;
    }
    return res.json({ story: summarized });
  } catch (error: any) {
    console.error(`[BLINK] Dynamic summarization failed for story ${storyId}:`, error);
    return res.status(500).json({ error: "Summarization failed", details: error.message });
  }
});

// Explain a news story using AI
app.post("/api/explain", async (req, res) => {
  const { storyId } = req.body;
  if (!storyId) {
    return res.status(400).json({ error: "storyId is required" });
  }

  // Find the story
  let story = LIVE_STORIES_CACHE.find((s) => s.id === storyId);
  if (!story) {
    story = INITIAL_STORIES.find((s) => s.id === storyId);
  }
  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }

  const ai = getAiClient();
  if (!ai) {
    console.log("Gemini API key not configured. Using local structured fallback.");
    return res.json({
      whatHappened: story.whatHappened || story.summary,
      whyImportant: story.whyItMatters || "This development could have significant implications for the sector, potentially altering existing policies or market conditions.",
      background: story.background || "Ongoing global trends and historical contexts pave the way for this event, as organizations seek optimized structures and solutions.",
      whoIsAffected: `Individuals, companies, and researchers in the ${story.category} sector.`,
      whatHappensNext: "Organizations will begin monitoring telemetry, adapting their frameworks, and releasing subsequent updates as results unfold.",
      isSimulated: true,
      message: "Connect your Gemini API Key in Settings > Secrets to unlock live AI summaries!"
    });
  }

  try {
    const prompt = `
      You are BLINK's highly intelligent AI assistant. Analyze the following news story and provide a concise, high-quality, and easy-to-understand explanation.
      
      STORY DETAILS:
      Category: ${story.category}
      Title: ${story.title}
      Summary: ${story.summary}
      Why It Matters: ${story.whyItMatters || ""}
      Additional Info: ${story.fullContent || ""} ${story.whatHappened || ""} ${story.background || ""}
      
      Please structure your output into exactly these 5 distinct areas:
      1. What happened? (A simple explanation of the core event)
      2. Why is it important? (Why does this matter to the average person or the world)
      3. Background (Brief historical or developmental context)
      4. Who is affected? (Explain which specific groups, sectors, or populations are impacted)
      5. What happens next? (Explain immediate upcoming events, based strictly on real possibilities or current reports)
      
      Keep the explanations extremely concise, easy-to-read, and targeted for a general audience.
    `;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatHappened: { type: Type.STRING, description: "A simple, clear explanation of what occurred." },
            whyImportant: { type: Type.STRING, description: "The reason why this event is significant." },
            background: { type: Type.STRING, description: "Context, history, or previous events." },
            whoIsAffected: { type: Type.STRING, description: "The groups, industries, or populations affected." },
            whatHappensNext: { type: Type.STRING, description: "Supported future steps or next phases." },
          },
          required: ["whatHappened", "whyImportant", "background", "whoIsAffected", "whatHappensNext"],
        },
      },
    }));

    const explanation = JSON.parse(response.text || "{}");
    return res.json({ ...explanation, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini Explain Error:", error);
    return res.json({
      whatHappened: story.whatHappened || story.summary,
      whyImportant: story.whyItMatters || "This development is highly relevant as it addresses core problems in the industry.",
      background: story.background || "This follows extensive research, trials, and strategic shifting within the global ecosystem.",
      whoIsAffected: `Direct stakeholders and general audiences interested in ${story.category}.`,
      whatHappensNext: "Immediate validation is underway, and further detailed reports are expected shortly.",
      isSimulated: true,
      error: error.message || "An error occurred while generating explanation."
    });
  }
});

// Ask AI about a news story
app.post("/api/ask", async (req, res) => {
  const { storyId, question } = req.body;
  if (!storyId || !question) {
    return res.status(400).json({ error: "storyId and question are required" });
  }

  // Find the story
  let story = LIVE_STORIES_CACHE.find((s) => s.id === storyId);
  if (!story) {
    story = INITIAL_STORIES.find((s) => s.id === storyId);
  }
  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }

  const ai = getAiClient();
  if (!ai) {
    console.log("Gemini API key not configured. Using local AI query engine.");
    
    const q = question.toLowerCase();
    let answer = "";
    
    if (q.includes("explain simply") || q.includes("simply") || q.includes("simple")) {
      answer = `Here is a simple explanation of this story: **${story.title}**. Basically, ${story.summary.replace(/^\w/, c => c.toLowerCase())} This is done by ${story.source} to address critical scientific, environmental, or technological needs.`;
    } else if (q.includes("why is this important") || q.includes("important") || q.includes("why it matters")) {
      answer = `This is extremely important because: ${story.whyItMatters || "it marks a significant breakthrough that can reshape industry practices, saving resources or improving ecological monitoring."}`;
    } else if (q.includes("background") || q.includes("before") || q.includes("history")) {
      answer = `For context: ${story.background || "This development is built on years of research, responding to global issues such as ocean climate changes, AI capability milestones, or high-performance scientific needs."}`;
    } else if (q.includes("summarize") || q.includes("points") || q.includes("3 points") || q.includes("three points")) {
      const points = story.keyPoints || [
        "Major milestone achieved in the field.",
        "Solves a long-standing physical or operational bottleneck.",
        "Lays down the foundation for future scalable developments."
      ];
      answer = `Here is a 3-point summary:\n\n1. ${points[0] || "Major step forward."}\n2. ${points[1] || "Addresses core limitations."}\n3. ${points[2] || "Unlocks long-term benefits."}`;
    } else {
      answer = `Regarding your question "${question}": Based on the reporting by ${story.source}, the story focuses on: "${story.summary}". ${story.whyItMatters ? `An important aspect is that: ${story.whyItMatters}` : ""}`;
    }

    return res.json({
      answer: answer,
      isSimulated: true,
      message: "Connect your Gemini API Key in Settings > Secrets to unlock live AI Chat!"
    });
  }

  try {
    const prompt = `
      You are BLINK's highly intelligent, friendly, and precise AI news assistant.
      The user is asking a question about a specific news story they are reading.
      
      STORY CONTEXT:
      Category: ${story.category}
      Title: ${story.title}
      Source: ${story.source}
      Summary: ${story.summary}
      Why It Matters: ${story.whyItMatters || ""}
      Key Points: ${JSON.stringify(story.keyPoints || [])}
      What Happened: ${story.whatHappened || ""}
      Background: ${story.background || ""}
      
      USER QUESTION:
      "${question}"
      
      INSTRUCTIONS:
      - Answer the user's question clearly, objectively, and conversationally.
      - Base your answer primarily on the story context provided above.
      - If the context does not contain the answer, state honestly that the information is not available in the current reporting, but offer general, relevant context if possible. Do NOT fabricate facts.
      - Keep your answer concise (1-3 paragraphs or simple bullet points), as the user values quick consumption.
    `;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    }));

    return res.json({
      answer: response.text || "I was unable to formulate a response. Please try again.",
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Gemini Ask Error:", error);
    return res.json({
      answer: `I apologize, but I encountered an error answering your question. Here is a brief summary of the story that might help:\n\n${story.summary}`,
      isSimulated: true,
      error: error.message || "Error occurred with Gemini query."
    });
  }
});

// Boot the server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
