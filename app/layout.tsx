import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "妆娘 - AI 脸型识别妆容推荐",
  description: "以 AI 脸型识别为核心，为你推荐适合的妆容和场景化妆造",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-display bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
