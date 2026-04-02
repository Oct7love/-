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
    <header className="fixed top-0 left-0 right-0 z-50 liquid-glass-nav">
      <nav className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold text-gray-900/90 tracking-tight">
          Oct7
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1 rounded-full text-xs text-gray-500 hover:text-gray-900 hover:bg-white/60 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm pl-1.5 pr-3 py-1 text-xs text-gray-700 hover:bg-white/80 transition-all"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[8px] bg-emerald-100 text-emerald-700">
                  {(session.user?.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              仪表盘
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                登录
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600/90 backdrop-blur-sm px-3.5 py-1 text-xs text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
              >
                免费开始
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/60 transition-colors"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden liquid-glass border-t border-white/20 px-4 py-4 space-y-2" style={{ borderRadius: 0 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-white/40"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/20 flex gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="flex-1 text-center rounded-full bg-emerald-600 px-4 py-2 text-sm text-white"
                onClick={() => setMobileOpen(false)}
              >
                仪表盘
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 text-center rounded-full border border-gray-300 px-4 py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center rounded-full bg-emerald-600 px-4 py-2 text-sm text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  免费开始
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-gray-900/5 to-transparent" />
    </header>
  );
}
