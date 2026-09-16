export interface NewsStory {
  id: string;
  category: string; // e.g., "India", "World", "Business", "Technology", "AI", "Sports", "Science", "Biotechnology", "Space", "Environment", "Entertainment", "Gaming"
  title: string;
  summary: string;
  whyItMatters?: string;
  source: string;
  publishedAt: string; // e.g., "2h ago" or "Yesterday"
  readTime: string; // e.g., "45 sec read"
  imageUrl: string;
  fullContent?: string;
  isBreaking?: boolean;
  timeline?: TimelineItem[];
  keyPoints?: string[];
  whatHappened?: string;
  background?: string;
  originalUrl?: string;
}

export interface TimelineItem {
  time: string; // e.g., "Monday — 10:00 AM"
  event: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  position: number;
  label: string;
  imageUrl: string;
}

export interface UserProfile {
  interests: string[];
  readingPreference: "Quickest" | "Balanced" | "More detailed";
  notifications: {
    breakingNews: boolean;
    dailyBriefing: boolean;
    topicUpdates: boolean;
    sportsUpdates: boolean;
    techUpdates: boolean;
  };
}

export interface SavedStory {
  id: string;
  savedAt: string;
}
