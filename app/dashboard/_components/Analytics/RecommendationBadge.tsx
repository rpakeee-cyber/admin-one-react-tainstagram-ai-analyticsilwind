import type { AnalysisStatus } from "../../../../src/types";

type Tone = AnalysisStatus | "repeat" | "pause" | "test" | "neutral";

type Props = {
  tone: Tone;
  label?: string;
};

const config: Record<Tone, { label: string; className: string }> = {
  strong: {
    label: "Сильная тема",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  medium: {
    label: "Стабильно",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  weak: {
    label: "Требует улучшения",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
  repeat: {
    label: "Повторить",
    className: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  pause: {
    label: "Пауза",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  test: {
    label: "Тестировать",
    className: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  },
  neutral: {
    label: "Локальный анализ",
    className: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

export default function RecommendationBadge({ tone, label }: Props) {
  const item = config[tone];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${item.className}`}
    >
      {label ?? item.label}
    </span>
  );
}
