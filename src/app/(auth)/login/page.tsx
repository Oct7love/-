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
    <div className="text-center">
      <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
        登录到 ResumeBoost
      </h1>
      <p className="mt-2 text-gray-500">
        继续优化你的简历
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs text-gray-600">密码</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              忘记密码？
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          登录
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        还没有账户？{" "}
        <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
          创建账户
        </Link>
      </p>
    </div>
  );
}
