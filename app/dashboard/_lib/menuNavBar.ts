import { mdiCogOutline, mdiThemeLightDark } from "@mdi/js";
import { MenuNavBarItem } from "../../_interfaces";

const menuNavBar: MenuNavBarItem[] = [
  {
    icon: mdiCogOutline,
    label: "Настройки",
    href: "/dashboard/settings",
    isDesktopNoLabel: true,
  },
  {
    icon: mdiThemeLightDark,
    label: "Светлая / тёмная тема",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
];

export default menuNavBar;
