"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function AiCoverLetter() {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jd, setJd] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!position.trim()) return;
    setLoading(true);
    setCoverLetter("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `请为以下岗位生成一封求职信（Cover Letter）：

公司：${companyName || "目标公司"}
职位：${position}
${jd ? `JD：${jd}` : ""}

要求：
- 300 字左右
- 语气诚恳专业
- 突出匹配度
- 不要太套路化
- 直接输出求职信内容`,
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
          setCoverLetter(text);
        }
      }
    } catch {
      setCoverLetter("生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          AI 求职信生成
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!coverLetter ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">公司名（可选）</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="如：字节跳动"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">目标职位</Label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="如：前端开发"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">JD（可选，效果更好）</Label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="粘贴职位描述..."
                rows={3}
                className="text-xs"
              />
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
                "生成求职信"
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {coverLetter}
              {loading && (
                <span className="inline-block w-1 h-4 bg-emerald-600 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setCoverLetter("")}
              >
                重新生成
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCopy}
                disabled={loading}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    复制
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
