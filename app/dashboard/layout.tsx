"use client";

import React, { ReactNode } from "react";
import { useState } from "react";
import { mdiInstagram, mdiMagnify } from "@mdi/js";
import menuAside from "./_lib/menuAside";
import menuNavBar from "./_lib/menuNavBar";
import Icon from "../_components/Icon";
import NavBar from "./_components/NavBar";
import NavBarItemPlain from "./_components/NavBar/Item/Plain";
import AsideMenu from "./_components/AsideMenu";
import FooterBar from "./_components/FooterBar";
import FormField from "../_components/FormField";
import { Field, Form, Formik } from "formik";
import MobileBottomNav from "./_components/MobileBottomNav";
import CloudAuthNotice from "./_components/CloudAuthNotice";

type Props = {
  children: ReactNode;
};

export default function LayoutAuthenticated({ children }: Props) {
  const isAsideMobileExpanded = false;
  const [isAsideLgActive, setIsAsideLgActive] = useState(false);

  const handleRouteChange = () => {
    setIsAsideLgActive(false);
  };

  const layoutAsidePadding = "lg:pl-60";

  return (
    <div className={`overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""
        } min-h-screen w-screen bg-gray-50 pt-14 pb-24 transition-(--transition-position) lg:w-auto lg:pb-0 dark:bg-slate-800 dark:text-slate-100`}
      >
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""}`}
        >
          <NavBarItemPlain display="flex lg:hidden">
            <span className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 to-violet-600 text-white">
                <Icon path={mdiInstagram} size="18" w="" h="" />
              </span>
              ReelScope
            </span>
          </NavBarItemPlain>
          <NavBarItemPlain display="hidden lg:flex" useMargin>
            <Formik
              initialValues={{
                search: "",
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              <Form>
                <FormField icon={mdiMagnify} isBorderless isTransparent>
                  {({ className }) => (
                    <Field
                      name="search"
                      placeholder="Поиск по Reels"
                      className={`${className} w-72`}
                    />
                  )}
                </FormField>
              </Form>
            </Formik>
          </NavBarItemPlain>
        </NavBar>
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
          onRouteChange={handleRouteChange}
        />
        <CloudAuthNotice />
        {children}
        <MobileBottomNav />
        <FooterBar>
          ReelScope AI · Demo dashboard без подключения Instagram API
        </FooterBar>
      </div>
    </div>
  );
}
