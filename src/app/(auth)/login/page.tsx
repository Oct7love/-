"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
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
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
        欢迎回来
      </h1>
      <p className="text-center text-sm text-gray-400 mt-1.5">
        登录你的 Oct7 账户
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
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
            className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              密码
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors"
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
            className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          登录
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
        <p className="text-center text-sm text-gray-400">
          还没有账户？{" "}
          <Link
            href="/register"
            className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors"
          >
            创建账户
          </Link>
        </p>
      </div>
    </>
  );
}
