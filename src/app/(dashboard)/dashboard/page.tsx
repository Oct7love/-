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
import { Progress } from "@/components/ui/progress";
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
  if (score >= 90) return "text-emerald-600";
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
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

  async function handleCreateResume(sourceType: "manual" | "template" = "manual", templateId?: string) {
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
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-2xl bg-gray-100" />
                <div className="h-5 w-32 bg-gray-100 rounded mt-3" />
                <div className="h-4 w-24 bg-gray-50 rounded mt-1" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-100 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-gray-100 rounded" />
                  <div className="h-8 flex-1 bg-gray-100 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">我的简历</h1>
          <p className="text-gray-500 mt-1">管理和优化你的简历</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            上传简历
          </Button>
          <Button onClick={() => setNewResumeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建简历
          </Button>
        </div>
      </div>

      {resumes.length === 0 && (
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
            onClick={() => handleCreateResume("manual")}
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

      {resumes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {resumes.map((resume) => (
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
                      <DropdownMenuItem
                        onClick={() => handleCopy(resume.id)}
                        disabled={actionLoading === resume.id}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteConfirmId(resume.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-3 text-lg">{resume.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant={statusMap[resume.status]?.variant ?? "secondary"}>
                    {statusMap[resume.status]?.label ?? resume.status}
                  </Badge>
                  <span>· 更新于 {formatDate(resume.updatedAt)}</span>
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
                  <Link
                    href={`/editor/${resume.id}`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "flex-1 bg-emerald-600 hover:bg-emerald-700"
                    )}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    诊断
                  </Link>
                </div>
              </CardContent>
            </Card>
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

      {/* AI usage card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="flex items-center justify-between py-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">简历管理</span>
            </div>
            <p className="text-sm text-gray-600">
              共 {resumes.length} 份简历 ·{" "}
              {resumes.filter((r) => r.lastScore !== null).length} 份已诊断
            </p>
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
            <button
              onClick={() => {
                setNewResumeOpen(false);
                handleCreateResume("manual");
              }}
              disabled={actionLoading === "create"}
              className="flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                {actionLoading === "create" ? (
                  <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                ) : (
                  <PenLine className="h-5 w-5 text-emerald-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">在线填写</div>
                <div className="text-xs text-gray-500">从空白开始，分模块编辑</div>
              </div>
            </button>
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后无法恢复，确定要删除这份简历吗？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={actionLoading === deleteConfirmId}
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
