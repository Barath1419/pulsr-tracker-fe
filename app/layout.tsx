import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pulsr — The Digital Curator",
  description: "Track your day as a timeline. Experience time tracking designed for deep work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-p-surface text-p-on-surface font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
