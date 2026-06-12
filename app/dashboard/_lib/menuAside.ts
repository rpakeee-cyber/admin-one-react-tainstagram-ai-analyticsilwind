import {
  mdiAccountGroupOutline,
  mdiCalendarMonthOutline,
  mdiCogOutline,
  mdiMovieOpenOutline,
  mdiPlusCircleOutline,
  mdiRobotOutline,
  mdiViewDashboardOutline,
} from "@mdi/js";
import { MenuAsideItem } from "../../_interfaces";

const menuAside: MenuAsideItem[] = [
  {
    href: "/dashboard",
    icon: mdiViewDashboardOutline,
    label: "Dashboard",
  },
  {
    href: "/dashboard/reels",
    label: "Reels",
    icon: mdiMovieOpenOutline,
  },
  {
    href: "/dashboard/add-reel",
    label: "Добавить Reel",
    icon: mdiPlusCircleOutline,
  },
  {
    href: "/dashboard/ai-recommendations",
    label: "AI-инсайты",
    icon: mdiRobotOutline,
  },
  {
    href: "/dashboard/audience",
    label: "Аудитория",
    icon: mdiAccountGroupOutline,
  },
  {
    href: "/dashboard/content-plan",
    label: "Контент-план",
    icon: mdiCalendarMonthOutline,
  },
  {
    href: "/dashboard/settings",
    label: "Настройки",
    icon: mdiCogOutline,
  },
];

export default menuAside;
