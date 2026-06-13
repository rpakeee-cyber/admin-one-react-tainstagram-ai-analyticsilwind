import type { Metadata } from "next";
import "../css/main.css";
import StoreProvider from "./_stores/StoreProvider";

const title = "ReelScope AI — Instagram Analytics Dashboard";

const description =
  "Личный dashboard для анализа Instagram Reels, аудитории, контент-плана и AI-рекомендаций.";

export const metadata: Metadata = {
  title,
  description,
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="ru" className="style-basic">
        <body className={`bg-gray-50 antialiased dark:bg-slate-800 dark:text-slate-100`}>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
