"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <FileQuestion className="h-20 w-20 text-gray-300 mx-auto" />
        <h1 className="mt-6 text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">页面未找到</p>
        <p className="mt-1 text-gray-400">你访问的页面不存在或已被移除</p>
        <Link
          href="/"
          className={cn(buttonVariants(), "mt-6")}
        >
          <Home className="h-4 w-4 mr-2" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
