"use client";

import {
  mdiHomeVariantOutline,
  mdiMovieOpenOutline,
  mdiPlus,
  mdiRobotOutline,
  mdiViewWeekOutline,
} from "@mdi/js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../../_components/Icon";

const items = [
  { href: "/dashboard", label: "Главная", icon: mdiHomeVariantOutline },
  { href: "/dashboard/reels", label: "Ролики", icon: mdiMovieOpenOutline },
  { href: "/dashboard/add-reel", label: "Добавить", icon: mdiPlus, isPrimary: true },
  { href: "/dashboard/ai-recommendations", label: "ИИ", icon: mdiRobotOutline },
  { href: "/dashboard/content-plan", label: "План", icon: mdiViewWeekOutline },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
                active ? "text-fuchsia-600 dark:text-fuchsia-400" : "text-gray-400"
              }`}
            >
              <span
                className={`flex h-9 w-11 items-center justify-center rounded-xl ${
                  item.isPrimary
                    ? "bg-linear-to-br from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-500/25"
                    : active
                      ? "bg-fuchsia-50 dark:bg-fuchsia-500/10"
                      : ""
                }`}
              >
                <Icon path={item.icon} size={item.isPrimary ? "22" : "20"} w="" h="" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
