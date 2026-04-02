"use client";

import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/templates", label: "模板中心", icon: Palette },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "用户";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="hidden md:flex w-60 flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
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

        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

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
        <header className="flex h-14 items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5">
          <div className="md:hidden flex items-center gap-2 font-bold">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-900 dark:text-white">Oct7</span>
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

        <main className="flex-1 p-6">{children}</main>
      </div>
      {!pathname.startsWith("/editor") && <AiChatBubble />}
    </div>
  );
}
