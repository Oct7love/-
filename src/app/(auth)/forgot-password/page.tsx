"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error?.message || "请求失败");
        return;
      }

      setSent(true);
    } catch {
      toast.error("服务器错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-5">
          <Mail className="h-6 w-6 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          检查你的邮箱
        </h1>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-[280px] mx-auto">
          如果该邮箱已注册，我们已向其发送了重置密码的链接。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 mt-6 text-sm text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
        重置密码
      </h1>
      <p className="text-center text-sm text-gray-400 mt-1.5">
        输入你的注册邮箱，我们将发送重置链接
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          发送重置链接
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回登录
        </Link>
      </div>
    </>
  );
}
