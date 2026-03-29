"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface ScoreDataPoint {
  date: string;
  score: number;
}

interface ScoreChartProps {
  data: ScoreDataPoint[];
  title?: string;
}

export function ScoreChart({
  data,
  title = "评分趋势",
}: ScoreChartProps) {
  const maxScore = 100;
  const chartHeight = 120;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 text-center py-6">
            暂无评分记录，开始诊断后这里会显示趋势
          </p>
        </CardContent>
      </Card>
    );
  }

  function scoreColor(score: number) {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1.5" style={{ height: chartHeight }}>
          {data.map((point, i) => {
            const barHeight = (point.score / maxScore) * chartHeight;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10"
                >
                  {point.score}分
                </div>
                <div
                  className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                  style={{
                    height: barHeight,
                    backgroundColor: scoreColor(point.score),
                    opacity: 0.7 + (i / data.length) * 0.3,
                  }}
                />
                <span className="text-[9px] text-gray-400 truncate w-full text-center">
                  {point.date}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          <span>最近 {data.length} 次诊断</span>
          <span>
            最高 {Math.max(...data.map((d) => d.score))} 分 / 最低{" "}
            {Math.min(...data.map((d) => d.score))} 分
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
