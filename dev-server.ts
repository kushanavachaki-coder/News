import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_STORIES, TRENDING_TOPICS } from "./src/newsData";
import { fetchLiveNews, summarizeStoryWithGemini, callGeminiWithRetry } from "./src/rssProcessor";
import { RSS_SOURCES } from "./src/rssConfig";
import { NewsStory } from "./src/types";
import {
  LIVE_STORIES_CACHE,
  IS_FETCHING_FEEDS,
  getAiClient,
  updateLiveNewsCache,
  getDynamicTrendingTopics,
} from "./src/backendState";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Start initial feed fetch at startup for local/dev
if (!process.env.VERCEL) {
  updateLiveNewsCache();
  // Poll every 15 minutes for new articles
  setInterval(updateLiveNewsCache, 15 * 60 * 1000);
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
    // Return grounded local fallbacks if Gemini is not configured
    story.whyItMatters = "AI significance analysis is temporarily unavailable.";
    story.keyPoints = [
      story.summary || "No description provided."
    ];
    story.background = "AI historical context is temporarily unavailable.";
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
      whyImportant: story.whyItMatters || "AI-generated deep-dive is currently unavailable. No additional significance data is present in the source RSS feed.",
      background: story.background || "AI-generated historical background is currently unavailable.",
      whoIsAffected: `Direct audiences and observers of the ${story.category} category.`,
      whatHappensNext: "AI future predictions are unavailable without active Gemini API keys.",
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
      whyImportant: "AI significance analysis is temporarily unavailable due to a service error.",
      background: "AI historical context is temporarily unavailable due to a service error.",
      whoIsAffected: "Specific stakeholder mapping is temporarily unavailable.",
      whatHappensNext: "Next-step analysis is temporarily unavailable.",
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
    
    const explanationText = `Offline Mode: No Gemini API Key is configured. Based strictly on the verified story summary: "${story.summary}" (reported by ${story.source}). To ask custom interactive questions, please connect your Gemini API Key under Settings > Secrets.`;

    return res.json({
      answer: explanationText,
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
      answer: `I apologize, but I encountered an error answering your question. Live AI chat is temporarily unavailable. Here is the verified report summary:\n\n${story.summary}`,
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
