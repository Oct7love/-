"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, BookOpen, MessageSquare, Brain, Target } from "lucide-react";

const tips = [
  {
    category: "STAR 法则",
    icon: Target,
    color: "text-emerald-600 bg-emerald-50",
    tip: "描述经历时使用 STAR 法则：情境(Situation) → 任务(Task) → 行动(Action) → 结果(Result)。比如「在日活千万的电商场景下(S)，需要优化首屏加载速度(T)，通过代码分割和懒加载(A)，将加载时间减少40%(R)」。",
  },
  {
    category: "量化成果",
    icon: Brain,
    color: "text-blue-600 bg-blue-50",
    tip: "尽量用数字说话：用户量、增长率、节省时间、降低成本。没有精确数字也可以用「显著」「大幅」等词，但要准备好面试时解释。",
  },
  {
    category: "行动动词",
    icon: MessageSquare,
    color: "text-purple-600 bg-purple-50",
    tip: "用「主导」「搭建」「优化」「推动」「落地」替代「负责」「参与」。强动词让你从「做了什么」变成「带来了什么」。",
  },
  {
    category: "ATS 关键词",
    icon: BookOpen,
    color: "text-amber-600 bg-amber-50",
    tip: "70% 的简历在 ATS 系统阶段就被筛掉。确保简历中包含 JD 里的关键技术词汇，尤其是工具名称、方法论和行业术语。",
  },
  {
    category: "一页简历",
    icon: Lightbulb,
    color: "text-rose-600 bg-rose-50",
    tip: "10 年以下工作经验建议控制在 1 页。删掉不相关的经历，只保留最强的 2-3 段。HR 平均只花 7 秒扫一份简历。",
  },
  {
    category: "项目重于技能",
    icon: Target,
    color: "text-teal-600 bg-teal-50",
    tip: "与其列一长串技能，不如在项目描述中自然展示。「使用 React + TypeScript 重构商品详情页」比「熟悉 React」有说服力 10 倍。",
  },
  {
    category: "简历≠工作日志",
    icon: Brain,
    color: "text-indigo-600 bg-indigo-50",
    tip: "简历不是流水账。每段经历只需 3-5 个 bullet point，每个都要传达「我做了什么+产生了什么价值」。",
  },
  {
    category: "定制简历",
    icon: MessageSquare,
    color: "text-orange-600 bg-orange-50",
    tip: "不要「一份简历投所有」。针对每个目标岗位调整简历的重点和关键词，匹配度高的简历面试率提升 3 倍。",
  },
];

export function InterviewTips() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tip = tips[currentIndex];
  const TipIcon = tip.icon;

  function nextTip() {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            每日锦囊
          </CardTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={nextTip}
            className="text-gray-400 hover:text-gray-600"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Badge className={`mb-2 gap-1 ${tip.color} border-0`}>
          <TipIcon className="h-3 w-3" />
          {tip.category}
        </Badge>
        <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
          <span>{currentIndex + 1} / {tips.length}</span>
          <button onClick={nextTip} className="text-emerald-600 hover:underline">
            下一条 →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
