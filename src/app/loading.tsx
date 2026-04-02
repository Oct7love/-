import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center space-y-4">
        <Sparkles className="h-8 w-8 text-emerald-500 mx-auto animate-pulse" />
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    </div>
  );
}
