"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  return (
    <div className="text-center">
      <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
        创建你的账户
      </h1>
      <p className="mt-2 text-gray-500">
        免费开始优化你的简历
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-gray-600">昵称</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="你的名字"
            required
            autoComplete="name"
            className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-gray-600">邮箱</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-gray-600">密码</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="至少 8 位，包含大小写和数字"
            required
            minLength={8}
            autoComplete="new-password"
            className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          创建账户
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        已有账户？{" "}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          登录
        </Link>
      </p>

      <p className="mt-4 text-xs text-gray-400">
        注册即表示你同意我们的
        <Link href="/terms" className="underline hover:text-gray-500">使用条款</Link>
        和
        <Link href="/privacy" className="underline hover:text-gray-500">隐私政策</Link>
      </p>
    </div>
  );
}
