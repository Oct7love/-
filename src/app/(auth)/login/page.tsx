"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("邮箱或密码错误");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("服务器错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-tight text-center text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
        登录你的账户
      </h1>
      <p className="text-center text-[15px] text-[#86868b] mt-2 leading-relaxed">
        使用 Oct7 账户继续
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-[13px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5"
          >
            邮箱地址
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            autoComplete="email"
            className="w-full h-[46px] px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#48484a] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-medium text-[#6e6e73] dark:text-[#a1a1a6]"
            >
              密码
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-[#0071e3] hover:text-[#0077ED] transition-colors"
            >
              忘记密码？
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full h-[46px] px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#48484a] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] rounded-xl bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ED] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          登录
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#d2d2d7]/60 dark:border-[#38383a]">
        <p className="text-center text-[14px] text-[#86868b]">
          还没有账户？{" "}
          <Link
            href="/register"
            className="text-[#0071e3] font-medium hover:text-[#0077ED] transition-colors"
          >
            创建账户
          </Link>
        </p>
      </div>
    </>
  );
}
