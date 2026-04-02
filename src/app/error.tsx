"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-md px-4">
        <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          出了点问题
        </h2>
        <p className="mt-2 text-gray-500">
          抱歉，页面遇到了错误。请尝试刷新页面或返回首页。
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
