"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
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
    "w-full h-[46px] px-4 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#48484a] text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all";

  return (
    <>
      <h1 className="text-[28px] font-semibold tracking-tight text-center text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
        创建你的账户
      </h1>
      <p className="text-center text-[15px] text-[#86868b] mt-2 leading-relaxed">
        注册即享{" "}
        <span className="text-[#0071e3] font-medium">7 天 Pro</span> 体验
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-[13px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5"
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
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5"
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
          className="w-full h-[46px] rounded-xl bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ED] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          创建账户
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#d2d2d7]/60 dark:border-[#38383a]">
        <p className="text-center text-[14px] text-[#86868b]">
          已有账户？{" "}
          <Link
            href="/login"
            className="text-[#0071e3] font-medium hover:text-[#0077ED] transition-colors"
          >
            登录
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#aeaeb2] leading-relaxed">
        注册即表示你同意{" "}
        <Link
          href="/terms"
          className="underline hover:text-[#86868b] transition-colors"
        >
          使用条款
        </Link>{" "}
        和{" "}
        <Link
          href="/privacy"
          className="underline hover:text-[#86868b] transition-colors"
        >
          隐私政策
        </Link>
      </p>
    </>
  );
}
