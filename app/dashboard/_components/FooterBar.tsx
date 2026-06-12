import React, { ReactNode } from "react";
import { containerMaxW } from "../../_lib/config";

type Props = {
  children: ReactNode;
};

export default function FooterBar({ children }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className={`px-6 py-6 text-sm text-gray-400 ${containerMaxW}`}>
      <div className="text-center md:text-left">
        <b className="text-gray-600 dark:text-slate-300">&copy; {year} ReelScope AI.</b>
        {` `}
        {children}
      </div>
    </footer>
  );
}
