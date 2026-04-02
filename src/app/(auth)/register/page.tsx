"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "注册失败");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success("欢迎使用 Oct7");
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      toast.error("服务器错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-[360px]">
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        <h1 className="text-[28px] font-semibold tracking-tight text-center text-gray-900">
          创建你的账户
        </h1>
        <p className="text-center text-[15px] text-gray-400 mt-2">
          注册即享 <span className="text-emerald-500 font-medium">7 天 Pro</span> 体验
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="name" className="block text-[13px] font-medium text-gray-500 mb-2">你的名字</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="输入昵称"
              required
              autoComplete="name"
              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[15px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-gray-500 mb-2">邮箱地址</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[15px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-gray-500 mb-2">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="至少 8 位，包含大小写和数字"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[15px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gray-900 text-white text-[15px] font-medium hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            创建账户
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-gray-400">
          已有账户？{" "}
          <Link href="/login" className="text-gray-900 font-medium hover:text-emerald-600 transition-colors">
            登录
          </Link>
        </p>

        <p className="mt-4 text-center text-[12px] text-gray-300 leading-relaxed">
          注册即表示你同意
          <Link href="/terms" className="underline hover:text-gray-400 transition-colors">使用条款</Link>
          和
          <Link href="/privacy" className="underline hover:text-gray-400 transition-colors">隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
