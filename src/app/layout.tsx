import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/components/shared/session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oct7 — AI 简历优化平台",
  description:
    "基于 AI 的在线简历优化平台，帮助求职者快速诊断、改写和美化简历，提升面试邀约率。",
  keywords: ["简历优化", "AI简历", "简历模板", "求职", "面试"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans tracking-tight">
        <SessionProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
