"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadDialog } from "@/components/shared/upload-dialog";
import { ScoreChart } from "@/components/shared/score-chart";
import { SalaryEstimator } from "@/components/shared/salary-estimator";
import { InterviewTips } from "@/components/shared/interview-tips";
import { SelfIntroGenerator } from "@/components/shared/self-intro-generator";
import { MockInterview } from "@/components/shared/mock-interview";
import { cn } from "@/lib/utils";
import {
  Plus,
  Upload,
  MoreVertical,
  FileText,
  Pencil,
  Copy,
  Trash2,
  Search,
  Sparkles,
  FileUp,
  PenLine,
  Palette,
  ArrowRight,
} from "lucide-react";

const mockResumes = [
  {
    id: "1",
    title: "前端工程师简历",
    status: "completed" as const,
    lastScore: 78,
    updatedAt: "3月28日",
  },
  {
    id: "2",
    title: "产品经理简历",
    status: "draft" as const,
    lastScore: null,
    updatedAt: "3月29日",
  },
];

const statusMap = {
  draft: { label: "草稿", variant: "secondary" as const },
  completed: { label: "已完成", variant: "default" as const },
  archived: { label: "已归档", variant: "outline" as const },
};

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newResumeOpen, setNewResumeOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">我的简历</h1>
          <p className="text-gray-500 mt-1">管理和优化你的简历</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            上传简历
          </Button>
          <Button onClick={() => setNewResumeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建简历
          </Button>
        </div>
      </div>

      {/* Quick start cards (show when no resumes) */}
      {mockResumes.length === 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-dashed"
            onClick={() => setUploadOpen(true)}
          >
            <CardContent className="pt-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <FileUp className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">上传 PDF / Word</h3>
              <p className="text-sm text-gray-500">
                上传已有简历，AI 自动解析内容
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-dashed"
            onClick={() => setNewResumeOpen(true)}
          >
            <CardContent className="pt-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <PenLine className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">在线填写</h3>
              <p className="text-sm text-gray-500">
                从零开始，分模块填写简历
              </p>
            </CardContent>
          </Card>
          <Link href="/templates">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-dashed h-full">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Palette className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold">从模板开始</h3>
                <p className="text-sm text-gray-500">
                  选择行业模板，快速创建
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Resume list */}
      {mockResumes.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mockResumes.map((resume) => (
            <Card
              key={resume.id}
              className="group transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-3 text-lg">{resume.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant={statusMap[resume.status].variant}>
                    {statusMap[resume.status].label}
                  </Badge>
                  <span>· 更新于 {resume.updatedAt}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resume.lastScore !== null ? (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">诊断分数</span>
                    <span
                      className={`text-2xl font-bold ${scoreColor(resume.lastScore)}`}
                    >
                      {resume.lastScore}
                    </span>
                    <span className="text-sm text-gray-400">/100</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-4">尚未诊断</p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/editor/${resume.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "flex-1"
                    )}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    编辑
                  </Link>
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Search className="mr-1 h-3 w-3" />
                    诊断
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dashboard widgets */}
      <div className="grid gap-5 md:grid-cols-3">
        <ScoreChart
          data={[
            { date: "3/20", score: 52 },
            { date: "3/22", score: 61 },
            { date: "3/24", score: 68 },
            { date: "3/26", score: 72 },
            { date: "3/28", score: 78 },
          ]}
        />
        <SalaryEstimator />
        <InterviewTips />
      </div>

      {/* AI tools */}
      <div className="grid gap-5 md:grid-cols-2">
        <SelfIntroGenerator />
        <MockInterview />
      </div>

      {/* AI usage card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="flex items-center justify-between py-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">本月 AI 用量</span>
            </div>
            <p className="text-sm text-gray-600">
              已使用 1/3 次 AI 诊断 · 0/3 次 AI 改写
            </p>
            <div className="flex gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">诊断</div>
                <Progress value={33} className="w-32 h-1.5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">改写</div>
                <Progress value={0} className="w-32 h-1.5" />
              </div>
            </div>
          </div>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "outline" }), "border-emerald-300")}
          >
            升级专业版
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </CardContent>
      </Card>

      {/* Upload dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={(content) => {
          console.log("Parsed:", content);
          setUploadOpen(false);
        }}
      />

      {/* New resume dialog */}
      <Dialog open={newResumeOpen} onOpenChange={setNewResumeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>创建新简历</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <button
              onClick={() => {
                setNewResumeOpen(false);
                setUploadOpen(true);
              }}
              className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <FileUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm">上传已有简历</div>
                <div className="text-xs text-gray-500">支持 PDF、Word、TXT 格式</div>
              </div>
            </button>
            <Link
              href="/editor/new"
              onClick={() => setNewResumeOpen(false)}
              className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <PenLine className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm">在线填写</div>
                <div className="text-xs text-gray-500">从空白开始，分模块编辑</div>
              </div>
            </Link>
            <Link
              href="/templates"
              onClick={() => setNewResumeOpen(false)}
              className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Palette className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm">从模板创建</div>
                <div className="text-xs text-gray-500">选择行业模板，快速开始</div>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
