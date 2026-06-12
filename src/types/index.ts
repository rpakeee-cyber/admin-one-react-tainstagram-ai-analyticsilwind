export type ReelStatus = "published" | "draft" | "scheduled";

export type Reel = {
  id: string;
  title: string;
  topic: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  newFollowers: number;
  score: number;
  duration: number;
  status: ReelStatus;
  accent: string;
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
