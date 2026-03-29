"use client";

import { Sparkles } from "lucide-react";

export function FullPageLoading({ message = "加载中..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Sparkles className="h-8 w-8 text-emerald-500 mx-auto animate-pulse" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoading({ message = "加载中..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}
