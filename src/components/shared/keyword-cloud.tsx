"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags } from "lucide-react";

interface KeywordCloudProps {
  keywords: { text: string; weight: number; matched?: boolean }[];
  title?: string;
}

export function KeywordCloud({
  keywords,
  title = "关键词热力图",
}: KeywordCloudProps) {
  const maxWeight = Math.max(...keywords.map((k) => k.weight));

  function getSize(weight: number): string {
    const ratio = weight / maxWeight;
    if (ratio > 0.8) return "text-base font-bold";
    if (ratio > 0.6) return "text-sm font-semibold";
    if (ratio > 0.4) return "text-xs font-medium";
    return "text-[11px]";
  }

  function getColor(matched?: boolean, weight?: number): string {
    if (matched === false) return "text-red-400 bg-red-50 border-red-200/50";
    const ratio = (weight || 0) / maxWeight;
    if (ratio > 0.7) return "text-emerald-700 bg-emerald-100/80 border-emerald-300/50";
    if (ratio > 0.4) return "text-emerald-600 bg-emerald-50 border-emerald-200/50";
    return "text-gray-600 bg-gray-50 border-gray-200/50";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Tags className="h-4 w-4 text-emerald-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <span
              key={kw.text}
              className={`inline-flex items-center px-2 py-0.5 rounded-full border transition-transform hover:scale-105 cursor-default ${getSize(kw.weight)} ${getColor(kw.matched, kw.weight)}`}
            >
              {kw.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
