"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          检查你的邮箱
        </h1>
        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
          如果该邮箱已注册，我们已向其发送了重置密码的链接。请检查收件箱（和垃圾邮件文件夹）。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 mt-6 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
        重置密码
      </h1>
      <p className="mt-2 text-gray-500">
        输入你的注册邮箱，我们将发送重置链接
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
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          发送重置链接
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          返回登录
        </Link>
      </p>
    </div>
  );
}
