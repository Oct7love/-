"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VersionScore {
  version: string;
  date: string;
  totalScore: number;
  dimensions: {
    name: string;
    score: number;
    maxScore: number;
  }[];
}

const mockVersions: VersionScore[] = [
  {
    version: "v1",
    date: "3月20日",
    totalScore: 52,
    dimensions: [
      { name: "完整性", score: 10, maxScore: 20 },
      { name: "描述", score: 15, maxScore: 30 },
      { name: "关键词", score: 10, maxScore: 20 },
      { name: "排版", score: 10, maxScore: 15 },
      { name: "印象", score: 7, maxScore: 15 },
    ],
  },
  {
    version: "v2 (当前)",
    date: "3月28日",
    totalScore: 78,
    dimensions: [
      { name: "完整性", score: 18, maxScore: 20 },
      { name: "描述", score: 22, maxScore: 30 },
      { name: "关键词", score: 15, maxScore: 20 },
      { name: "排版", score: 13, maxScore: 15 },
      { name: "印象", score: 10, maxScore: 15 },
    ],
  },
];

export function ResumeComparison() {
  const [comparing, setComparing] = useState(false);

  const v1 = mockVersions[0];
  const v2 = mockVersions[1];
  const totalDiff = v2.totalScore - v1.totalScore;

  if (!comparing) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-3">
          <GitCompare className="h-8 w-8 text-emerald-500 mx-auto" />
          <h3 className="font-semibold text-sm">版本对比</h3>
          <p className="text-xs text-gray-500">对比不同版本的简历，查看优化效果</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setComparing(true)}
          >
            查看对比
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-emerald-600" />
          版本对比
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-xs text-gray-400">{v1.version}</div>
            <div className="text-2xl font-bold text-gray-400">{v1.totalScore}</div>
          </div>
          <div className="flex flex-col items-center">
            <ArrowRight className="h-4 w-4 text-emerald-500" />
            <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-0">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              +{totalDiff}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-gray-400">{v2.version}</div>
            <div className="text-2xl font-bold text-emerald-600">{v2.totalScore}</div>
          </div>
        </div>

        <div className="space-y-1.5">
          {v2.dimensions.map((dim, i) => {
            const diff = dim.score - v1.dimensions[i].score;
            const DiffIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
            const diffColor = diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-gray-400";
            return (
              <div key={dim.name} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-gray-500">{dim.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right">{dim.score}</span>
                <span className={`flex items-center gap-0.5 w-8 ${diffColor}`}>
                  <DiffIcon className="h-3 w-3" />
                  {Math.abs(diff)}
                </span>
              </div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="xs"
          className="w-full text-gray-400"
          onClick={() => setComparing(false)}
        >
          收起
        </Button>
      </CardContent>
    </Card>
  );
}
