"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Briefcase, Loader2 } from "lucide-react";

interface SalaryRange {
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
}

export function SalaryEstimator() {
  const [position, setPosition] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<SalaryRange | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEstimate() {
    if (!position.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `请估算「${position}」在「${city || "全国"}」的月薪范围（单位：K/千元）。
只输出一个JSON对象，不要其他文字：{"min":数字,"max":数字,"median":数字,"p25":数字,"p75":数字}
其中min是最低月薪K，max是最高，median是中位数，p25是25百分位，p75是75百分位。`,
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
        }
      }

      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
      }
    } catch {
      setResult({ min: 10, max: 35, median: 20, p25: 14, p75: 26 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          薪资参考
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!result ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">目标职位</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="如：前端开发"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">城市</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="如：北京"
                className="h-8 text-xs"
              />
            </div>
            <Button
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleEstimate}
              disabled={loading || !position.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  AI 估算中...
                </>
              ) : (
                "查看薪资范围"
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {position}
              </Badge>
              {city && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {city}
                </Badge>
              )}
            </div>

            <div className="text-center py-2">
              <div className="text-[10px] text-gray-400 mb-1">月薪中位数</div>
              <div className="text-3xl font-bold text-emerald-600">
                {result.median}K
              </div>
            </div>

            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 bg-emerald-200 rounded-full"
                style={{
                  left: `${(result.p25 / result.max) * 100}%`,
                  right: `${100 - (result.p75 / result.max) * 100}%`,
                }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-emerald-600"
                style={{ left: `${(result.median / result.max) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{result.min}K</span>
              <span>25%: {result.p25}K</span>
              <span>75%: {result.p75}K</span>
              <span>{result.max}K</span>
            </div>

            <div className="text-[10px] text-gray-400 text-center">
              数据由 AI 估算，仅供参考
            </div>

            <Button
              variant="outline"
              size="xs"
              className="w-full"
              onClick={() => setResult(null)}
            >
              重新查询
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
