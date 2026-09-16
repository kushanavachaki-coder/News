import { VercelRequest, VercelResponse } from "@vercel/node";
import { LIVE_STORIES_CACHE, getAiClient } from "../src/backendState.js";
import { INITIAL_STORIES } from "../src/newsData.js";
import { callGeminiWithRetry } from "../src/rssProcessor.js";

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

  const { storyId, story: reqStory, question } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

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
    console.log("Gemini API key not configured. Using local AI query engine fallback.");
    
    const explanationText = `Offline Mode: No Gemini API Key is configured. Based strictly on the verified story summary: "${story.summary}" (reported by ${story.source}). To ask custom interactive questions, please connect your Gemini API Key under Settings > Secrets.`;
    
    return res.status(200).json({
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

    return res.status(200).json({
      answer: response.text || "I was unable to formulate a response. Please try again.",
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Gemini Ask Error:", error);
    return res.status(200).json({
      answer: `I apologize, but I encountered an error answering your question. Live AI chat is temporarily unavailable. Here is the verified report summary:\n\n${story.summary}`,
      isSimulated: true,
      error: error.message || "Error occurred with Gemini query."
    });
  }
}
