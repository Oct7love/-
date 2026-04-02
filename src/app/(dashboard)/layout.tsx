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
    <div className="flex min-h-screen bg-[#f5f5f7] dark:bg-[#111111]">
      <aside className="hidden md:flex w-[220px] flex-col bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-r border-[#d2d2d7]/50 dark:border-[#38383a]">
        <div className="flex h-[52px] items-center px-5">
          <Link
            href="/dashboard"
            className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight"
          >
            Oct7
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-1 space-y-0.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-colors",
                pathname === item.href
                  ? "bg-[#0071e3]/10 text-[#0071e3]"
                  : "text-[#6e6e73] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
              )}
            >
              <item.icon className="h-[16px] w-[16px]" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#d2d2d7]/50 dark:border-[#38383a] p-3">
          <div className="flex items-center gap-2.5 px-2">
            <Avatar className="h-7 w-7">
              {session?.user?.image && (
                <AvatarImage src={session.user.image} />
              )}
              <AvatarFallback className="bg-[#e8e8ed] dark:bg-[#38383a] text-[#6e6e73] text-[11px]">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                {userName}
              </p>
              <p className="text-[11px] text-[#86868b] truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-[52px] items-center justify-between bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-[#d2d2d7]/50 dark:border-[#38383a] px-5">
          <div className="md:hidden text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Oct7
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors outline-none">
                <Avatar className="h-7 w-7">
                  {session?.user?.image && (
                    <AvatarImage src={session.user.image} />
                  )}
                  <AvatarFallback className="bg-[#e8e8ed] dark:bg-[#38383a] text-[#6e6e73] text-[11px]">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7]">
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
                  className="text-[#ff3b30]"
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
