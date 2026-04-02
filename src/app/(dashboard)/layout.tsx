"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AiChatBubble } from "@/components/shared/ai-chat-bubble";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-lg"
          >
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Oct7
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              {session?.user?.image && (
                <AvatarImage src={session.user.image} />
              )}
              <AvatarFallback className="bg-emerald-100 text-emerald-600 text-sm">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-gray-950 dark:border-gray-800 px-6">
          <div className="md:hidden flex items-center gap-2 font-bold">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Oct7
          </div>

          <div className="flex-1" />

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted transition-colors outline-none">
              <Avatar className="h-8 w-8">
                {session?.user?.image && (
                  <AvatarImage src={session.user.image} />
                )}
                <AvatarFallback className="bg-emerald-100 text-emerald-600 text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{userName}</span>
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
                className="text-red-600"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
      {!pathname.startsWith("/editor") && <AiChatBubble />}
    </div>
  );
}
