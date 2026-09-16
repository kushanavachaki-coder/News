import { VercelRequest, VercelResponse } from "@vercel/node";
import { LIVE_STORIES_CACHE, getAiClient } from "../../src/backendState";
import { INITIAL_STORIES } from "../../src/newsData";
import { summarizeStoryWithGemini } from "../../src/rssProcessor";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { storyId, story: reqStory } = req.body || {};

  let story = reqStory;
  if (story && typeof story === "object" && story.title && story.source && story.category) {
    // Valid story object passed statelessly from the frontend
  } else {
    // Fall back to local search if not provided
    if (!storyId) {
      return res.status(400).json({ error: "Either complete story object or storyId is required" });
    }
    story = LIVE_STORIES_CACHE.find((s) => s.id === storyId);
    if (!story) {
      story = INITIAL_STORIES.find((s) => s.id === storyId);
    }
  }

  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }

  // If already summarized, return immediately
  if (story.whyItMatters && story.whyItMatters.trim() !== "") {
    return res.status(200).json({ story });
  }

  const ai = getAiClient();
  if (!ai) {
    // Return grounded local fallbacks if Gemini is not configured
    story.whyItMatters = "AI significance analysis is temporarily unavailable.";
    story.keyPoints = [
      story.summary || "No description provided."
    ];
    story.background = "AI historical context is temporarily unavailable.";
    return res.status(200).json({ story });
  }

  try {
    const summarized = await summarizeStoryWithGemini(ai, story);
    // Update story in caches
    const liveIdx = LIVE_STORIES_CACHE.findIndex((s) => s.id === storyId);
    if (liveIdx !== -1) {
      LIVE_STORIES_CACHE[liveIdx] = summarized;
    }
    return res.status(200).json({ story: summarized });
  } catch (error: any) {
    console.error(`[BLINK] Dynamic summarization failed for story ${storyId}:`, error);
    return res.status(500).json({ error: "Summarization failed", details: error.message });
  }
}
