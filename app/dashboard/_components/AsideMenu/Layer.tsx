import React from "react";
import { mdiClose, mdiInstagram } from "@mdi/js";
import Icon from "../../../_components/Icon";
import AsideMenuList from "./List";
import { MenuAsideItem } from "../../../_interfaces";

type Props = {
  menu: MenuAsideItem[];
  className?: string;
  onAsideLgCloseClick: () => void;
  onRouteChange: () => void;
};

export default function AsideMenuLayer({ menu, className = "", ...props }: Props) {
  const handleAsideLgCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onAsideLgCloseClick();
  };

  return (
    <aside
      className={`${className} fixed top-0 z-40 hidden h-screen w-60 overflow-hidden transition-(--transition-position) lg:flex lg:py-2 lg:pl-2`}
    >
      <div
        className={`aside flex flex-1 flex-col overflow-hidden lg:rounded-2xl dark:bg-slate-900`}
      >
        <div
          className={`aside-brand flex h-14 flex-row items-center justify-between dark:bg-slate-900`}
        >
          <div className="flex flex-1 items-center gap-3 px-5 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg shadow-fuchsia-500/20">
              <Icon path={mdiInstagram} size="20" w="" h="" />
            </span>
            <div>
              <b className="block text-sm font-black">ReelScope AI</b>
              <span className="text-[10px] text-gray-400">Instagram analytics</span>
            </div>
          </div>
          <button
            className="hidden p-3 lg:inline-block xl:hidden"
            onClick={handleAsideLgCloseClick}
          >
            <Icon path={mdiClose} />
          </button>
        </div>
        <div
          className={`aside-scrollbar flex-1 overflow-x-hidden overflow-y-auto dark:scrollbar-styled-dark`}
        >
          <AsideMenuList menu={menu} onRouteChange={props.onRouteChange} />
        </div>
        <div className="m-4 rounded-2xl bg-white/5 p-4 text-xs text-gray-400">
          <p className="font-semibold text-white">Demo workspace</p>
          <p className="mt-1 leading-5">Данные Instagram пока не подключены.</p>
        </div>
      </div>
    </aside>
  );
}
