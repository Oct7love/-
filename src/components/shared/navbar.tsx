"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(251,251,253,0.8)] dark:bg-[rgba(29,29,31,0.8)] backdrop-blur-xl backdrop-saturate-[1.8]">
      <nav className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-4 lg:px-0">
        <Link
          href="/"
          className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight"
        >
          Oct7
        </Link>

        <div className="hidden md:flex items-center gap-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1 text-[12px] text-[#424245] dark:text-[#d2d2d7] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-[#0071e3] px-3.5 py-1 text-[12px] text-white hover:bg-[#0077ED] transition-colors"
            >
              仪表盘
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[12px] text-[#424245] dark:text-[#d2d2d7] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#0071e3] px-3.5 py-1 text-[12px] text-white hover:bg-[#0077ED] transition-colors"
              >
                免费开始
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg text-[#424245] hover:text-[#1d1d1f] transition-colors"
        >
          {mobileOpen ? (
            <X className="h-[18px] w-[18px]" />
          ) : (
            <Menu className="h-[18px] w-[18px]" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#d2d2d7]/40 dark:border-[#424245]/40 px-4 py-3 space-y-1 bg-[rgba(251,251,253,0.95)] dark:bg-[rgba(29,29,31,0.95)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#d2d2d7]/40 dark:border-[#424245]/40 flex gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="flex-1 text-center rounded-full bg-[#0071e3] px-4 py-2.5 text-[14px] text-white"
                onClick={() => setMobileOpen(false)}
              >
                仪表盘
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 text-center rounded-full border border-[#d2d2d7] dark:border-[#424245] px-4 py-2.5 text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  onClick={() => setMobileOpen(false)}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center rounded-full bg-[#0071e3] px-4 py-2.5 text-[14px] text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  免费开始
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-px bg-[#d2d2d7]/60 dark:bg-[#424245]/60" />
    </header>
  );
}
