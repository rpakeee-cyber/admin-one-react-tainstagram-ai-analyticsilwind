export const reelTopics = [
  "Работа",
  "Спорт",
  "Влог",
  "Бизнес",
  "Kaspi",
  "Церковь",
  "Личная мысль",
  "Обучение",
  "Тренд",
  "Другое",
] as const;

export const reelFormats = [
  "Talking Head",
  "Vlog",
  "POV",
  "Storytelling",
  "Tutorial",
  "Trend",
  "Before/After",
  "Day in Life",
  "Motivation",
  "Other",
] as const;

export type ReelTopic = (typeof reelTopics)[number];
export type ReelFormat = (typeof reelFormats)[number];

export type Reel = {
  id: string;
  title: string;
  publishDate: string;
  topic: ReelTopic;
  format: ReelFormat;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  newFollowers: number;
  durationSeconds: number;
  retentionRate: number;
  hook: string;
  link: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ReelInput = Omit<Reel, "id" | "createdAt" | "updatedAt">;

export type ReelFormValues = {
  title: string;
  publishDate: string;
  topic: ReelTopic;
  format: ReelFormat;
  views: string;
  reach: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  newFollowers: string;
  durationSeconds: string;
  retentionRate: string;
  hook: string;
  link: string;
  notes: string;
};

export type Metric = {
  id: string;
  label: string;
  value: number;
  change: number;
  format: "number" | "percent" | "score";
  direction: "up" | "down" | "neutral";
};

export type AIInsight = {
  id: string;
  title: string;
  summary: string;
  recommendation: string;
  impact: string;
  priority: "high" | "medium" | "low";
  category: "hook" | "topic" | "timing" | "format";
};

export type ReelInsight = {
  strength: string;
  weakness: string;
  repeatTopic: string;
  nextStep: string;
};

export type ContentPlanStatus = "idea" | "script" | "ready" | "scheduled";

export type ContentPlanItem = {
  id: string;
  date: string;
  title: string;
  topic: string;
  format: string;
  objective: string;
  status: ContentPlanStatus;
};

export type AudienceSegment = {
  label: string;
  value: number;
};

export type AudienceData = {
  totalFollowers: number;
  followerGrowth: number;
  topCities: AudienceSegment[];
  ageGroups: AudienceSegment[];
  gender: AudienceSegment[];
  activeHours: AudienceSegment[];
};
