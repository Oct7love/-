"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mic, Loader2, Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";

type Duration = "30s" | "1min" | "3min";

export function SelfIntroGenerator() {
  const [position, setPosition] = useState("");
  const [duration, setDuration] = useState<Duration>("1min");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!position.trim()) return;
    setLoading(true);
    setResult("");

    const wordCount = duration === "30s" ? "80-100" : duration === "1min" ? "150-200" : "400-500";

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `请为面试「${position}」岗位生成一段${duration === "30s" ? "30秒" : duration === "1min" ? "1分钟" : "3分钟"}的自我介绍。

要求：
- 约${wordCount}字
- 开头简洁有力，不要"你好，我叫xxx"这种套路
- 突出与岗位相关的核心竞争力
- 用具体数据或案例支撑
- 结尾表达对岗位的热情
- 口语化，适合面试现场说出来

直接输出自我介绍内容，不要其他说明。`,
        }),
      });

      if (!res.ok) throw new Error();

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setResult(text);
        }
      }
    } catch {
      setResult("生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("已复制");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Mic className="h-4 w-4 text-emerald-600" />
          AI 自我介绍
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!result ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">目标岗位</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="如：前端开发工程师"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">时长</Label>
              <div className="flex gap-1.5">
                {([
                  { v: "30s" as Duration, label: "30 秒" },
                  { v: "1min" as Duration, label: "1 分钟" },
                  { v: "3min" as Duration, label: "3 分钟" },
                ]).map((d) => (
                  <button
                    key={d.v}
                    onClick={() => setDuration(d.v)}
                    className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs border transition-colors ${
                      duration === d.v
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="sm"
              onClick={handleGenerate}
              disabled={loading || !position.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  生成中...
                </>
              ) : (
                "生成自我介绍"
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-[10px]">{position}</Badge>
              <Badge variant="outline" className="text-[10px] gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {duration === "30s" ? "30秒" : duration === "1min" ? "1分钟" : "3分钟"}
              </Badge>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto">
              {result}
              {loading && <span className="inline-block w-1 h-4 bg-emerald-600 animate-pulse ml-0.5 align-middle" />}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setResult("")}>
                重新生成
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCopy}
                disabled={loading}
              >
                {copied ? <><Check className="h-3 w-3 mr-1" />已复制</> : <><Copy className="h-3 w-3 mr-1" />复制</>}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
