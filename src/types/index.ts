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

export type AnalysisStatus = "strong" | "medium" | "weak";

export type ReelRankingMetric =
  | "views"
  | "engagementRate"
  | "saves"
  | "shares"
  | "newFollowers"
  | "score";

export type WeakReelRankingMetric = "views" | "engagementRate" | "followerConversion" | "score";

export type TopicAnalysis = {
  topic: ReelTopic;
  count: number;
  averageViews: number;
  averageEngagementRate: number;
  averageSaves: number;
  averageShares: number;
  totalNewFollowers: number;
  averageScore: number;
  status: AnalysisStatus;
};

export type FormatAnalysis = {
  format: ReelFormat;
  count: number;
  averageViews: number;
  averageEngagementRate: number;
  averageFollowerConversion: number;
  averageScore: number;
  status: AnalysisStatus;
};

export type HookPerformanceGroup = {
  count: number;
  averageViews: number;
  averageEngagementRate: number;
  averageScore: number;
};

export type HookExample = {
  reelId: string;
  reelTitle: string;
  hook: string;
  score: number;
};

export type HookAnalysis = {
  withHook: HookPerformanceGroup;
  withoutHook: HookPerformanceGroup;
  topHooks: HookExample[];
  repeatHooks: string[];
  shouldPrioritizeHooks: boolean;
};

export type PostingDayAnalysis = {
  dayIndex: number;
  dayName: string;
  count: number;
  averageViews: number;
  averageEngagementRate: number;
  averageFollowerConversion: number;
  averageScore: number;
  status: AnalysisStatus;
};

export type PostingDaysAnalysis = {
  days: PostingDayAnalysis[];
  bestDay: PostingDayAnalysis | null;
  bestDays: PostingDayAnalysis[];
  weakDays: PostingDayAnalysis[];
};

export type ContentGoal =
  | "Охват"
  | "Подписки"
  | "Доверие"
  | "Личный бренд"
  | "Полезность"
  | "Эксперимент";

export type ContentDirectionSignal = {
  kind: "topic" | "format" | "day";
  value: string;
  status: AnalysisStatus;
  score: number;
};

export type ContentIdeaSeed = {
  topic: ReelTopic;
  format: ReelFormat;
  goal: ContentGoal;
};

export type ContentDirection = {
  topTopics: TopicAnalysis[];
  weakTopics: TopicAnalysis[];
  topFormats: FormatAnalysis[];
  weakFormats: FormatAnalysis[];
  bestPostingDays: PostingDayAnalysis[];
  repeatRecommendations: ContentDirectionSignal[];
  stopRecommendations: ContentDirectionSignal[];
  nextIdeas: ContentIdeaSeed[];
  hookSuggestions: string[];
  summary: {
    dataLevel: "empty" | "low" | "personalized";
    topTopic: ReelTopic | null;
    topFormat: ReelFormat | null;
    bestDay: string | null;
    primaryRisk:
      | "limited-data"
      | "missing-hooks"
      | "low-engagement"
      | "low-follower-conversion"
      | "none";
  };
};

export type DashboardRecommendation = {
  insight: AIInsight;
  topTopics: TopicAnalysis[];
  topFormats: FormatAnalysis[];
  bestPostingDay: string;
  mainRisk: string;
  nextStep: string;
  dataLevel: ContentDirection["summary"]["dataLevel"];
};

export type ReelInsight = {
  score: number;
  strength: string;
  weakness: string;
  whyWorked: string;
  whyLowConversion: string;
  repeatTopic: string;
  improveNext: string;
  hookSuggestions: string[];
  continuationIdea: string;
};

export type ContentIdea = {
  id: string;
  title: string;
  topic: ReelTopic;
  format: ReelFormat;
  hook: string;
  goal: ContentGoal;
  reason: string;
};

export type WeeklyPlanItem = {
  id: string;
  day: string;
  date: string;
  title: string;
  topic: ReelTopic;
  format: ReelFormat;
  hook: string;
  goal: ContentGoal;
  reason: string;
  status: ContentPlanStatus;
};

export type WeeklyRecommendations = {
  dataLevel: ContentDirection["summary"]["dataLevel"];
  summary: string;
  whatToShoot: string[];
  repeatTopics: string[];
  pauseItems: string[];
  formatsToTest: string[];
  hooks: string[];
  schedule: WeeklyPlanItem[];
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
