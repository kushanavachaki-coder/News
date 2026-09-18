import { NewsStory, UserProfile } from "../types.js";

/**
 * Helper to parse a "publishedAt" string (e.g. "2h ago", "1d ago") into an approximate number of hours.
 */
export const parsePublishedToHours = (pubStr: string): number => {
  if (!pubStr) return 999;
  const normalized = pubStr.toLowerCase().trim();

  if (normalized.includes("sec") || normalized.includes("min")) {
    return 0; // Extremely recent
  }

  const hMatch = normalized.match(/^(\d+)\s*h\s*ago/);
  if (hMatch) {
    return parseInt(hMatch[1], 10);
  }

  const dMatch = normalized.match(/^(\d+)\s*d\s*ago/);
  if (dMatch) {
    return parseInt(dMatch[1], 10) * 24;
  }

  if (normalized === "yesterday") {
    return 24;
  }

  return 48; // Older fallback
};

/**
 * Helper to parse reading time string (e.g. "45 sec read", "1.5 min read") into seconds.
 */
export const parseReadTimeToSeconds = (readStr: string): number => {
  if (!readStr) return 45;
  const normalized = readStr.toLowerCase().trim();

  const secMatch = normalized.match(/^(\d+)\s*sec/);
  if (secMatch) {
    return parseInt(secMatch[1], 10);
  }

  const minMatch = normalized.match(/^(\d+(\.\d+)?)\s*min/);
  if (minMatch) {
    return parseFloat(minMatch[1]) * 60;
  }

  return 45;
};

interface RankedStory extends NewsStory {
  score: number;
}

/**
 * Deterministically ranks and orders stories based on user interests, recency, 
 * breaking news flags, reading preference, and a custom diversity layout.
 */
export const rankStoriesForUser = (stories: NewsStory[], profile: UserProfile | null): NewsStory[] => {
  if (!profile || !profile.interests || profile.interests.length === 0) {
    // If no user is authenticated or profile has no interests, preserve default order (usually recency)
    return [...stories];
  }

  const userInterestsLower = profile.interests.map((interest) => interest.toLowerCase());

  // 1. Compute deterministic scores
  const scoredStories: RankedStory[] = stories.map((story) => {
    let score = 0;
    let matchedInterestName = "";

    // A. User Interests Boost
    const storyCategoryLower = story.category.toLowerCase();
    const matchedIdx = userInterestsLower.indexOf(storyCategoryLower);
    
    if (matchedIdx !== -1) {
      score += 100; // Strong relevance boost
      matchedInterestName = profile.interests[matchedIdx];
    }

    // B. Breaking News Boost
    if (story.isBreaking) {
      score += 30; // Moderate boost
    }

    // C. Recency Boost
    const hoursAgo = parsePublishedToHours(story.publishedAt);
    const recencyScore = Math.max(0, 50 - hoursAgo * 2.5); // Max +50 points for fresh news
    score += recencyScore;

    // D. Reading Preference Affinity Adjustment
    const readSeconds = parseReadTimeToSeconds(story.readTime || "");
    if (profile.readingPreference === "Quickest") {
      if (readSeconds <= 40) score += 10;
    } else if (profile.readingPreference === "More detailed") {
      const hasTimeline = story.timeline && story.timeline.length > 0;
      const hasKeyPoints = story.keyPoints && story.keyPoints.length > 0;
      if (readSeconds >= 60 || hasTimeline || hasKeyPoints) {
        score += 10;
      }
    }

    // Clone the story and append metadata
    return {
      ...story,
      score,
      personalizationReason: matchedInterestName 
        ? `Because you follow ${matchedInterestName}` 
        : undefined,
    };
  });

  // 2. Base sorting descending by calculated score
  const baseSorted = scoredStories.sort((a, b) => b.score - a.score);

  // 3. Diversification Pass (Avoid consecutive category clustering)
  const diversified: NewsStory[] = [];
  const remaining = [...baseSorted];

  while (remaining.length > 0) {
    const lastCategory = diversified.length > 0 
      ? diversified[diversified.length - 1].category 
      : null;

    let selectedIndex = 0;

    // If the top scoring candidate shares the category of the last item in the list,
    // look forward up to 5 items to find a non-clashing candidate with a close score.
    if (lastCategory && remaining[0].category === lastCategory) {
      const topScore = remaining[0].score;
      for (let i = 1; i < Math.min(remaining.length, 5); i++) {
        const scoreDifference = topScore - remaining[i].score;
        // Promote if the category differs and the score difference is minor (<= 25 points)
        if (remaining[i].category !== lastCategory && scoreDifference <= 25) {
          selectedIndex = i;
          break;
        }
      }
    }

    const [chosen] = remaining.splice(selectedIndex, 1);
    
    // Clean up temporary score property before returning
    const { score, ...cleanStory } = chosen;
    diversified.push(cleanStory);
  }

  return diversified;
};
