"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#features", label: "功能" },
  { href: "/pricing", label: "定价" },
  { href: "/templates", label: "模板" },
  { href: "/help", label: "帮助" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4 lg:px-0">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 dark:text-white tracking-tight"
        >
          <span className="text-emerald-500">Oct</span>7
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 pl-1.5 pr-4 py-1.5 text-sm text-white hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-white/20 text-white">
                  {(session.user?.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              仪表盘
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
              >
                免费开始
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-1 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="flex-1 text-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                仪表盘
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 text-center rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileOpen(false)}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  免费开始
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-px bg-gray-100 dark:bg-gray-800" />
    </header>
  );
}
