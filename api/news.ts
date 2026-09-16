import { VercelRequest, VercelResponse } from "@vercel/node";
import { LIVE_STORIES_CACHE, updateLiveNewsCache, getDynamicTrendingTopics, IS_FETCHING_FEEDS } from "../src/backendState.js";

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

  try {
    // If cache is empty, trigger fetch immediately
    if (LIVE_STORIES_CACHE.length === 0 && !IS_FETCHING_FEEDS) {
      await updateLiveNewsCache();
    }

    if (LIVE_STORIES_CACHE.length === 0) {
      return res.status(503).json({
        success: false,
        error: "Live news feeds are temporarily unavailable. Please try again shortly.",
      });
    }

    const trending = getDynamicTrendingTopics(LIVE_STORIES_CACHE);

    return res.status(200).json({
      stories: LIVE_STORIES_CACHE,
      trendingTopics: trending,
    });
  } catch (error: any) {
    console.error("[BLINK] /api/news handler failed:", error);
    return res.status(503).json({
      success: false,
      error: "Live news feeds are temporarily unavailable.",
      details: error.message || "An unexpected error occurred."
    });
  }
}
