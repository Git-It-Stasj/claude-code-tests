export interface UserProfile {
  name: string;
  niche: string;
  platforms: string[];
  goals: string[];
  tone: string;
  productDescription: string;
}

export type ContentType =
  | "hook"
  | "caption"
  | "story"
  | "calendar"
  | "recruiting"
  | "customer"
  | "engagement";

export interface GeneratedContent {
  id: string;
  type: ContentType;
  platform: string;
  text: string;
  hashtags: string[];
  tone: string;
  wordCount: number;
  charCount: number;
  saved: boolean;
  calendarDate?: string;
}

export interface CalendarDay {
  date: string;
  content?: GeneratedContent;
  contentType?: ContentType;
}

export const CONTENT_TYPES: {
  id: ContentType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: "hook", label: "Hook Generator", icon: "🔥", description: "Scroll-stopping opening lines" },
  { id: "caption", label: "Caption Creator", icon: "📖", description: "Full post captions with CTAs" },
  { id: "story", label: "Story Script", icon: "🎥", description: "3-slide IG/FB story scripts" },
  { id: "calendar", label: "30-Day Calendar", icon: "📅", description: "A full month of post ideas" },
  { id: "recruiting", label: "Recruiting Post", icon: "💬", description: "Team-building focused content" },
  { id: "customer", label: "Customer Post", icon: "❤️", description: "Product/service focused content" },
  { id: "engagement", label: "Engagement Post", icon: "🙋", description: "Questions & polls to boost reach" },
];

export const NICHES = [
  "Health & Wellness",
  "Beauty",
  "Finance",
  "Mindset & Coaching",
  "Other",
];

export const PLATFORMS = ["Instagram", "Facebook", "TikTok", "LinkedIn"];
export const GOALS = ["Attract customers", "Recruit teammates", "Build personal brand"];
export const TONES = ["Inspirational", "Educational", "Humorous", "Relatable", "Bold"];
