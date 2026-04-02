"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { toast } from "sonner";
import {
  Plus,
  Upload,
  MoreVertical,
  FileText,
  Pencil,
  Copy,
  Trash2,
  Sparkles,
  FileUp,
  PenLine,
  Palette,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  status: "draft" | "completed" | "archived";
  lastScore: number | null;
  updatedAt: string;
  createdAt: string;
}

const statusMap = {
  draft: { label: "草稿", variant: "secondary" as const },
  completed: { label: "已完成", variant: "default" as const },
  archived: { label: "已归档", variant: "outline" as const },
};

function scoreColor(score: number) {
  if (score >= 80) return "text-[#34c759]";
  if (score >= 60) return "text-[#ff9f0a]";
  return "text-[#ff3b30]";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newResumeOpen, setNewResumeOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    try {
      const res = await fetch("/api/resumes");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResumes(data.data ?? []);
    } catch {
      toast.error("加载简历列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  async function handleCreateResume(
    sourceType: "manual" | "template" = "manual",
    templateId?: string
  ) {
    setActionLoading("create");
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "未命名简历",
          sourceType,
          templateId,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      router.push(`/editor/${data.data.id}`);
    } catch {
      toast.error("创建失败，请重试");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("简历已删除");
    } catch {
      toast.error("删除失败");
    } finally {
      setActionLoading(null);
      setDeleteConfirmId(null);
    }
  }

  async function handleCopy(id: string) {
    setActionLoading(id);
    try {
      const detailRes = await fetch(`/api/resumes/${id}`);
      if (!detailRes.ok) throw new Error();
      const detail = await detailRes.json();

      const createRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${detail.data.title} (副本)`,
          sourceType: "manual",
        }),
      });
      if (!createRes.ok) throw new Error();
      const created = await createRes.json();

      await fetch(`/api/resumes/${created.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: detail.data.content }),
      });

      fetchResumes();
      toast.success("简历已复制");
    } catch {
      toast.error("复制失败");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUploadComplete(parsedContent: unknown) {
    try {
      const createRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "已上传简历", sourceType: "upload" }),
      });
      if (!createRes.ok) throw new Error();
      const created = await createRes.json();

      await fetch(`/api/resumes/${created.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: parsedContent }),
      });

      setUploadOpen(false);
      router.push(`/editor/${created.data.id}`);
    } catch {
      toast.error("保存失败");
    }
  }

  const scoreData = resumes
    .filter((r) => r.lastScore !== null)
    .slice(0, 5)
    .reverse()
    .map((r) => ({
      date: formatDate(r.updatedAt),
      score: r.lastScore!,
    }));

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-[#e8e8ed] dark:bg-[#38383a] rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-[#e8e8ed] dark:bg-[#38383a] rounded-lg mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a] p-6 animate-pulse"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#e8e8ed] dark:bg-[#38383a]" />
              <div className="h-5 w-32 bg-[#e8e8ed] dark:bg-[#38383a] rounded-lg mt-4" />
              <div className="h-4 w-24 bg-[#e8e8ed] dark:bg-[#38383a] rounded-lg mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            我的简历
          </h1>
          <p className="text-[#86868b] text-[14px] mt-1">管理和优化你的简历</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setUploadOpen(true)}
            className="rounded-lg border-[#d2d2d7] dark:border-[#48484a] text-[13px] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
          >
            <Upload className="mr-1.5 h-4 w-4" />
            上传
          </Button>
          <Button
            onClick={() => setNewResumeOpen(true)}
            className="rounded-lg bg-[#0071e3] hover:bg-[#0077ED] text-[13px]"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            新建
          </Button>
        </div>
      </div>

      {resumes.length === 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileUp,
              title: "上传 PDF / Word",
              desc: "上传已有简历，AI 自动解析内容",
              onClick: () => setUploadOpen(true),
            },
            {
              icon: PenLine,
              title: "在线填写",
              desc: "从零开始，分模块填写简历",
              onClick: () => handleCreateResume("manual"),
            },
            {
              icon: Palette,
              title: "从模板开始",
              desc: "选择行业模板，快速创建",
              href: "/templates",
            },
          ].map((item) => {
            const content = (
              <div className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-dashed border-[#d2d2d7] dark:border-[#48484a] p-6 text-center space-y-3 cursor-pointer hover:border-[#0071e3] hover:shadow-sm transition-all">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-[#0071e3]" />
                </div>
                <h3 className="font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#86868b]">{item.desc}</p>
              </div>
            );

            if ("href" in item) {
              return (
                <Link key={item.title} href={item.href!}>
                  {content}
                </Link>
              );
            }
            return (
              <div key={item.title} onClick={item.onClick}>
                {content}
              </div>
            );
          })}
        </div>
      )}

      {resumes.length > 0 && (
        <div
          className={`grid gap-4 ${
            resumes.length <= 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="group rounded-2xl bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a] p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                  <FileText className="h-5 w-5 text-[#0071e3]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]">
                    <MoreVertical className="h-4 w-4 text-[#86868b]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleCopy(resume.id)}
                      disabled={actionLoading === resume.id}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-[#ff3b30]"
                      onClick={() => setDeleteConfirmId(resume.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="mt-3 text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                {resume.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={statusMap[resume.status]?.variant ?? "secondary"}
                >
                  {statusMap[resume.status]?.label ?? resume.status}
                </Badge>
                <span className="text-[12px] text-[#86868b]">
                  {formatDate(resume.updatedAt)}
                </span>
              </div>

              {resume.lastScore !== null ? (
                <div className="flex items-baseline gap-1 mt-4">
                  <span
                    className={`text-[28px] font-bold ${scoreColor(resume.lastScore)}`}
                  >
                    {resume.lastScore}
                  </span>
                  <span className="text-[13px] text-[#86868b]">/100</span>
                </div>
              ) : (
                <p className="text-[13px] text-[#aeaeb2] mt-4">尚未诊断</p>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/editor/${resume.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex-1 rounded-lg border-[#d2d2d7] dark:border-[#48484a] text-[13px]"
                  )}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  编辑
                </Link>
                <Link
                  href={`/editor/${resume.id}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "flex-1 rounded-lg bg-[#0071e3] hover:bg-[#0077ED] text-[13px]"
                  )}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  诊断
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard widgets */}
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreChart data={scoreData} />
        <SalaryEstimator />
        <InterviewTips />
      </div>

      {/* AI tools */}
      <div className="grid gap-4 md:grid-cols-2">
        <SelfIntroGenerator />
        <MockInterview />
      </div>

      {/* Summary card */}
      <div className="rounded-2xl bg-[#1d1d1f] dark:bg-[#f5f5f7] p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0071e3]" />
              <span className="font-semibold text-[15px] text-white dark:text-[#1d1d1f]">
                简历管理
              </span>
            </div>
            <p className="text-[13px] text-[#86868b]">
              共 {resumes.length} 份简历 ·{" "}
              {resumes.filter((r) => r.lastScore !== null).length} 份已诊断
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 rounded-lg bg-[#0071e3] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0077ED] transition-colors"
          >
            升级专业版
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Upload dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
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
              className="flex items-center gap-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] p-4 text-left hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                <FileUp className="h-5 w-5 text-[#0071e3]" />
              </div>
              <div>
                <div className="font-medium text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  上传已有简历
                </div>
                <div className="text-[12px] text-[#86868b]">
                  支持 PDF、Word、TXT 格式
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                setNewResumeOpen(false);
                handleCreateResume("manual");
              }}
              disabled={actionLoading === "create"}
              className="flex items-center gap-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] p-4 text-left hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                {actionLoading === "create" ? (
                  <Loader2 className="h-5 w-5 text-[#0071e3] animate-spin" />
                ) : (
                  <PenLine className="h-5 w-5 text-[#0071e3]" />
                )}
              </div>
              <div>
                <div className="font-medium text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  在线填写
                </div>
                <div className="text-[12px] text-[#86868b]">
                  从空白开始，分模块编辑
                </div>
              </div>
            </button>
            <Link
              href="/templates"
              onClick={() => setNewResumeOpen(false)}
              className="flex items-center gap-4 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] p-4 text-left hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                <Palette className="h-5 w-5 text-[#0071e3]" />
              </div>
              <div>
                <div className="font-medium text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  从模板创建
                </div>
                <div className="text-[12px] text-[#86868b]">
                  选择行业模板，快速开始
                </div>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后无法恢复，确定要删除这份简历吗？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="rounded-lg"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={actionLoading === deleteConfirmId}
              className="rounded-lg bg-[#ff3b30] hover:bg-[#ff453a]"
            >
              {actionLoading === deleteConfirmId && (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              )}
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
