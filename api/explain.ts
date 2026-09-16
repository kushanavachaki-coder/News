import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";
import { LIVE_STORIES_CACHE, getAiClient } from "../src/backendState";
import { INITIAL_STORIES } from "../src/newsData";
import { callGeminiWithRetry } from "../src/rssProcessor";

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
    return res.status(450).json({ error: "Method not allowed. Use POST." });
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

  const ai = getAiClient();
  if (!ai) {
    console.log("Gemini API key not configured. Using local structured fallback.");
    return res.status(200).json({
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
    return res.status(200).json({ ...explanation, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini Explain Error:", error);
    return res.status(200).json({
      whatHappened: story.whatHappened || story.summary,
      whyImportant: "AI significance analysis is temporarily unavailable due to a service error.",
      background: "AI historical context is temporarily unavailable due to a service error.",
      whoIsAffected: "Specific stakeholder mapping is temporarily unavailable.",
      whatHappensNext: "Next-step analysis is temporarily unavailable.",
      isSimulated: true,
      error: error.message || "An error occurred while generating explanation."
    });
  }
}
