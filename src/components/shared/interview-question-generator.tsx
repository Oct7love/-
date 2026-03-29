"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquareText, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Question {
  question: string;
  type: "behavioral" | "technical" | "situational";
  tip: string;
}

const mockQuestions: Question[] = [
  {
    question: "请描述一个你主导的技术难题，你是如何解决的？",
    type: "behavioral",
    tip: "用 STAR 法则，重点描述你的分析过程和最终成果。",
  },
  {
    question: "你在简历中提到做了性能优化，具体优化了哪些指标？",
    type: "technical",
    tip: "准备好具体的技术方案和量化数据，如 LCP、FCP 的变化。",
  },
  {
    question: "如果团队成员对你的技术方案有不同意见，你怎么处理？",
    type: "situational",
    tip: "展示你的沟通能力和开放态度，强调以数据和实验结果说话。",
  },
  {
    question: "你为什么想加入我们公司？",
    type: "behavioral",
    tip: "提前了解公司产品和文化，结合自己的职业规划回答。",
  },
  {
    question: "你简历上的组件库项目，你觉得最大的挑战是什么？",
    type: "technical",
    tip: "聊技术选型、API 设计、向下兼容等真实挑战，不要说没有挑战。",
  },
];

const typeLabels = {
  behavioral: { label: "行为面试", color: "bg-blue-50 text-blue-700" },
  technical: { label: "技术面试", color: "bg-purple-50 text-purple-700" },
  situational: { label: "情景面试", color: "bg-amber-50 text-amber-700" },
};

export function InterviewQuestionGenerator() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions.slice(0, 3));
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 3));
      setExpandedIndex(null);
      setLoading(false);
    }, 500);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-emerald-600" />
            模拟面试题
          </CardTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <p className="text-[10px] text-gray-400">
          基于你的简历生成可能被问到的面试题
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {questions.map((q, i) => {
          const typeConfig = typeLabels[q.type];
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} className="rounded-lg border border-gray-200/60 overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-start gap-2 p-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <Badge className={`shrink-0 text-[9px] px-1 py-0 border-0 ${typeConfig.color}`}>
                  {typeConfig.label}
                </Badge>
                <span className="text-xs text-gray-700 flex-1">{q.question}</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-gray-400 shrink-0 mt-0.5" />
                )}
              </button>
              {isExpanded && (
                <div className="px-2.5 pb-2.5 pt-0">
                  <div className="rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-700">
                    💡 {q.tip}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
