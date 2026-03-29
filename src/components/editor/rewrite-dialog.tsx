"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Check, X, Loader2 } from "lucide-react";

interface RewriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  onAdopt?: (text: string) => void;
}

type RewriteStyle = "professional" | "concise" | "creative";

const styleLabels: Record<RewriteStyle, string> = {
  professional: "专业正式",
  concise: "简洁有力",
  creative: "创意表达",
};

export function RewriteDialog({
  open,
  onOpenChange,
  originalText,
  onAdopt,
}: RewriteDialogProps) {
  const [style, setStyle] = useState<RewriteStyle>("concise");
  const [rewrittenText, setRewrittenText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRewrite() {
    setIsLoading(true);
    setRewrittenText("");

    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalText, style }),
      });

      if (!res.ok) throw new Error("改写失败");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setRewrittenText(text);
        }
      }
    } catch {
      setRewrittenText("改写失败，请重试");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdopt() {
    onAdopt?.(rewrittenText);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            AI 智能改写
          </DialogTitle>
        </DialogHeader>

        {/* Style selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">改写风格：</span>
          {(Object.entries(styleLabels) as [RewriteStyle, string][]).map(
            ([key, label]) => (
              <Badge
                key={key}
                variant={style === key ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStyle(key)}
              >
                {label}
              </Badge>
            )
          )}
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500">原文</h3>
            <div className="rounded-lg border bg-gray-50 p-4 text-sm min-h-[120px]">
              {originalText}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-emerald-600">优化后</h3>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-sm min-h-[120px]">
              {isLoading && !rewrittenText && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI 改写中...
                </div>
              )}
              {rewrittenText && (
                <span>
                  {rewrittenText}
                  {isLoading && (
                    <span className="inline-block w-1 h-4 bg-emerald-600 animate-pulse ml-0.5 align-middle" />
                  )}
                </span>
              )}
              {!isLoading && !rewrittenText && (
                <span className="text-gray-400">点击下方按钮开始改写</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRewrite} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {rewrittenText ? "重新生成" : "开始改写"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-1" />
              保留原文
            </Button>
            <Button
              onClick={handleAdopt}
              disabled={!rewrittenText || isLoading}
            >
              <Check className="h-4 w-4 mr-1" />
              采纳修改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
