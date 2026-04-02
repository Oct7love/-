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
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#e8f5e9] dark:bg-[#1b3a26] flex items-center justify-center mb-5">
          <Mail className="h-6 w-6 text-[#34c759] dark:text-[#30d158]" />
        </div>
        <h1 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          检查你的邮箱
        </h1>
        <p className="mt-3 text-[14px] text-[#86868b] leading-relaxed max-w-[300px] mx-auto">
          如果该邮箱已注册，我们已向其发送了重置密码的链接。请检查收件箱和垃圾邮件文件夹。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 mt-6 text-[14px] text-[#0071e3] hover:text-[#0077ED] font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-tight text-center text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
        重置密码
      </h1>
      <p className="text-center text-[15px] text-[#86868b] mt-2 leading-relaxed">
        输入你的注册邮箱，我们将发送重置链接
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] rounded-xl bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ED] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          发送重置链接
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#d2d2d7]/60 dark:border-[#38383a]">
        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-[14px] text-[#0071e3] hover:text-[#0077ED] font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回登录
        </Link>
      </div>
    </>
  );
}
