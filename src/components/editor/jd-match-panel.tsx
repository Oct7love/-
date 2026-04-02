"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Loader2, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface JdMatchPanelProps {
  resumeContent: unknown;
}

interface MatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  requirements: {
    requirement: string;
    status: "matched" | "partial" | "unmatched";
    evidence: string;
  }[];
  suggestions: string[];
}

const statusConfig = {
  matched: { icon: Check, color: "text-green-500", label: "匹配" },
  partial: { icon: AlertTriangle, color: "text-amber-500", label: "部分匹配" },
  unmatched: { icon: X, color: "text-red-500", label: "未匹配" },
};

export function JdMatchPanel({ resumeContent }: JdMatchPanelProps) {
  const [companyName, setCompanyName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [jdContent, setJdContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  async function handleAnalyze() {
    if (!jdContent.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent,
          jdContent,
          companyName,
          positionTitle,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data.data);
    } catch {
      setResult(null);
      toast.error("匹配分析失败，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function scoreColor(score: number) {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-emerald-600";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  }

  if (result) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600" />
            JD 匹配分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <span className={`text-3xl font-bold ${scoreColor(result.matchScore)}`}>
              {result.matchScore}%
            </span>
            <p className="text-xs text-gray-400 mt-1">匹配度</p>
            <Progress value={result.matchScore} className="h-2 mt-2" />
          </div>

          {result.matchedKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">
                已匹配关键词
              </p>
              <div className="flex gap-1 flex-wrap">
                {result.matchedKeywords.map((k) => (
                  <Badge key={k} variant="secondary" className="text-[10px]">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.missingKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1">
                缺失关键词
              </p>
              <div className="flex gap-1 flex-wrap">
                {result.missingKeywords.map((k) => (
                  <Badge key={k} variant="outline" className="text-[10px] text-red-500 border-red-200">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.requirements.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1">要求匹配</p>
              <div className="space-y-1.5">
                {result.requirements.slice(0, 5).map((req, i) => {
                  const cfg = statusConfig[req.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex gap-1.5 text-[10px]">
                      <Icon className={`h-3 w-3 shrink-0 mt-0.5 ${cfg.color}`} />
                      <span className="text-gray-600">{req.requirement}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1">优化建议</p>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-[10px] text-gray-600 flex gap-1">
                    <span className="text-emerald-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            variant="outline"
            size="xs"
            className="w-full"
            onClick={() => setResult(null)}
          >
            重新分析
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          JD 匹配分析
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">公司名称（可选）</Label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="如：字节跳动"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">职位名称（可选）</Label>
          <Input
            value={positionTitle}
            onChange={(e) => setPositionTitle(e.target.value)}
            placeholder="如：高级前端工程师"
            className="h-7 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">JD 内容</Label>
          <Textarea
            value={jdContent}
            onChange={(e) => setJdContent(e.target.value)}
            placeholder="粘贴目标岗位的职位描述..."
            rows={5}
            className="text-xs"
          />
        </div>
        <Button
          size="sm"
          className="w-full"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jdContent.trim()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-1" />
              分析匹配度
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
