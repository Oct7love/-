"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface CompletenessItem {
  label: string;
  status: "complete" | "partial" | "missing";
  description: string;
}

interface ResumeCompletenessProps {
  items?: CompletenessItem[];
}

const defaultItems: CompletenessItem[] = [
  { label: "个人信息", status: "complete", description: "姓名、联系方式已填写" },
  { label: "教育背景", status: "complete", description: "已添加 1 条教育经历" },
  { label: "工作经历", status: "partial", description: "已添加但缺少量化数据" },
  { label: "项目经历", status: "missing", description: "建议添加 2-3 个项目" },
  { label: "技能列表", status: "complete", description: "已列出技术栈" },
  { label: "个人简介", status: "missing", description: "建议添加 2-3 句话概述" },
];

const statusConfig = {
  complete: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  partial: {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  missing: {
    icon: Circle,
    color: "text-gray-300",
    bg: "bg-gray-50",
  },
};

export function ResumeCompleteness({
  items = defaultItems,
}: ResumeCompletenessProps) {
  const completedCount = items.filter((i) => i.status === "complete").length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">简历完整度</CardTitle>
          <span className="text-lg font-bold text-emerald-600">
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <div
              key={item.label}
              className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 ${config.bg}`}
            >
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {item.label}
                </p>
                <p className="text-[10px] text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
