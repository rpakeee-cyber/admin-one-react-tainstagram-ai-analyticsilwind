import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export default function PageIntro({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-fuchsia-600 uppercase dark:text-fuchsia-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base dark:text-slate-400">
          {description}
        </p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
