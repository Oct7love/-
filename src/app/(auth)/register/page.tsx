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

  const inputClassName =
    "w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all";

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
        创建你的账户
      </h1>
      <p className="text-center text-sm text-gray-400 mt-1.5">
        注册即享{" "}
        <span className="text-emerald-500 font-semibold">7 天 Pro</span> 体验
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            你的名字
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="输入昵称"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

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
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
          >
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="至少 8 位，包含大小写和数字"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          创建账户
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
        <p className="text-center text-sm text-gray-400">
          已有账户？{" "}
          <Link
            href="/login"
            className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors"
          >
            登录
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-[11px] text-gray-300 dark:text-gray-600 leading-relaxed">
        注册即表示你同意{" "}
        <Link
          href="/terms"
          className="underline hover:text-gray-400 transition-colors"
        >
          使用条款
        </Link>{" "}
        和{" "}
        <Link
          href="/privacy"
          className="underline hover:text-gray-400 transition-colors"
        >
          隐私政策
        </Link>
      </p>
    </>
  );
}
