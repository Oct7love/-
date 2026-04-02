"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AiChatBubble } from "@/components/shared/ai-chat-bubble";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  LayoutDashboard,
  Palette,
  Settings,
  LogOut,
  User,
  FileText,
  Target,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/templates", label: "模板中心", icon: Palette },
];

const toolNav = [
  { href: "/dashboard#score", label: "诊断评分", icon: FileText },
  { href: "/dashboard#jd", label: "JD 匹配", icon: Target },
  { href: "/dashboard#interview", label: "面试助手", icon: MessageSquare },
  { href: "/dashboard#salary", label: "薪资估算", icon: TrendingUp },
  { href: "/dashboard#intro", label: "自我介绍", icon: BookOpen },
];

const bottomNav = [
  { href: "/settings", label: "设置", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = session?.user?.name || "用户";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const isActive = (href: string) =>
    href.includes("#") ? pathname === "/dashboard" : pathname === href;

  const navContent = (
    <>
      <div className="px-3 pt-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 mb-1">
          导航
        </p>
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 mt-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 mb-1">
          AI 工具
        </p>
        <div className="space-y-0.5">
          {toolNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 mt-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 mb-1">
          账户
        </p>
        <div className="space-y-0.5">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <div className="flex h-14 items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-900 dark:text-white">
              <span className="text-emerald-500">Oct</span>7
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">{navContent}</nav>

        <div className="border-t border-gray-100 dark:border-gray-800 p-3">
          <div className="flex items-center gap-2.5 px-2">
            <Avatar className="h-8 w-8">
              {session?.user?.image && (
                <AvatarImage src={session.user.image} />
              )}
              <AvatarFallback className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="打开菜单"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <span className="md:hidden text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-emerald-500">Oct</span>7
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors outline-none">
                <Avatar className="h-8 w-8">
                  {session?.user?.image && (
                    <AvatarImage src={session.user.image} />
                  )}
                  <AvatarFallback className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
                  {userName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="h-4 w-4" />
                    个人设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-14 bottom-0 z-50 w-[240px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-y-auto py-2">
              {navContent}
            </div>
          </>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      {!pathname.startsWith("/editor") && <AiChatBubble />}
    </div>
  );
}
