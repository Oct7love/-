"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { RewriteDialog } from "@/components/editor/rewrite-dialog";
import { JdMatchPanel } from "@/components/editor/jd-match-panel";
import { ResumePreview } from "@/components/editor/resume-preview";
import { ResumeCompleteness } from "@/components/shared/resume-completeness";
import { AiCoverLetter } from "@/components/shared/ai-cover-letter";
import { ResumeComparison } from "@/components/shared/resume-comparison";
import { InterviewQuestionGenerator } from "@/components/shared/interview-question-generator";
import { useEditorStore } from "@/stores/editor-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import {
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Wrench,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  Check,
} from "lucide-react";
import type {
  ResumeContent,
  WorkExperience,
  Education,
  Project,
  DiagnosisResult,
  DiagnosisItem,
} from "@/types/resume";

const sectionIcons: Record<string, typeof User> = {
  personalInfo: User,
  education: GraduationCap,
  workExperience: Briefcase,
  projects: FolderOpen,
  skills: Wrench,
};

const sectionLabels: Record<string, string> = {
  personalInfo: "个人信息",
  education: "教育背景",
  workExperience: "工作经历",
  projects: "项目经历",
  skills: "技能特长",
};

const defaultContent: ResumeContent = {
  personalInfo: { name: "", phone: "", email: "", location: "", summary: "" },
  education: [],
  workExperience: [],
  projects: [],
  skills: { technical: [], soft: [], languages: [], certifications: [] },
  customSections: [],
  sectionOrder: ["personalInfo", "education", "workExperience", "projects", "skills"],
};

const severityConfig = {
  critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", label: "严重" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", label: "建议" },
  info: { icon: Info, color: "text-emerald-500", bg: "bg-emerald-50", label: "优化" },
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    resumeId, content, isDirty, isSaving, activeSection,
    diagnosis, diagnosisItems, isDiagnosing,
    setResumeId, setContent, updateContent, setActiveSection,
    setDirty, setSaving,
    setDiagnosis, setDiagnosisItems, setDiagnosing,
    isRewriting, setRewriting, setRewriteTarget,
    reset,
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("简历编辑器");
  const [rewriteOpen, setRewriteOpen] = useState(false);
  const [rewriteText, setRewriteText] = useState("");
  const [rightTab, setRightTab] = useState("ai");

  // Load resume data
  useEffect(() => {
    reset();

    async function loadResume() {
      if (id === "new") {
        try {
          const res = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "未命名简历", sourceType: "manual" }),
          });
          if (!res.ok) throw new Error();
          const data = await res.json();
          router.replace(`/editor/${data.data.id}`);
          return;
        } catch {
          toast.error("创建简历失败");
          router.push("/dashboard");
          return;
        }
      }

      try {
        const res = await fetch(`/api/resumes/${id}`);
        if (!res.ok) {
          toast.error("简历不存在");
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        const resume = data.data;
        setResumeId(resume.id);
        setTitle(resume.title);
        setContent(resume.content ?? defaultContent);
      } catch {
        toast.error("加载失败");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadResume();
    return () => reset();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save function
  const saveToServer = useCallback(async (data: ResumeContent) => {
    if (!resumeId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data, title }),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
    } catch {
      toast.error("自动保存失败");
    } finally {
      setSaving(false);
    }
  }, [resumeId, title, setSaving, setDirty]);

  // Auto-save
  useAutoSave(content, saveToServer, {
    delay: 3000,
    enabled: isDirty && !!resumeId,
  });

  // Warn before leaving with unsaved changes
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Manual save
  async function handleSave() {
    if (!content || !resumeId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
      toast.success("已保存");
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  }

  // Export
  function handleExport() {
    if (!resumeId) return;
    window.open(`/api/resumes/${resumeId}/export`, "_blank");
  }

  // AI Diagnose
  async function handleDiagnose() {
    if (!content) return;
    setDiagnosing(true);
    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: content, resumeId }),
      });
      const data = await res.json();
      if (data.success) {
        const result: DiagnosisResult = {
          totalScore: data.data.totalScore,
          dimensions: data.data.dimensions,
          overallSummary: data.data.overallSummary,
        };
        setDiagnosis(result);

        const items: DiagnosisItem[] = (data.data.items ?? []).map(
          (item: Record<string, unknown>, i: number) => ({
            id: `diag-${i}`,
            section: item.section as string,
            fieldPath: (item.fieldPath as string) ?? "",
            severity: item.severity as "critical" | "warning" | "info",
            category: (item.category as string) ?? "",
            originalText: (item.originalText as string) ?? "",
            suggestion: (item.suggestion as string) ?? "",
            rewrittenText: item.rewrittenText as string | undefined,
            isAdopted: false,
          })
        );
        setDiagnosisItems(items);

        toast.success(`诊断完成，评分 ${data.data.totalScore}/100`);
      } else {
        toast.error(data.error?.message ?? "诊断失败");
      }
    } catch {
      toast.error("诊断服务暂不可用，请稍后重试");
    } finally {
      setDiagnosing(false);
    }
  }

  // Content update helpers
  function updatePersonalInfo(field: string, value: string) {
    if (!content) return;
    updateContent({
      personalInfo: { ...content.personalInfo, [field]: value },
    });
  }

  function addWorkExperience() {
    if (!content) return;
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: "", position: "", startDate: "", endDate: "",
      isCurrent: false, description: "", highlights: [""],
    };
    updateContent({ workExperience: [...content.workExperience, newExp] });
  }

  function addEducation() {
    if (!content) return;
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: "", degree: "", major: "", startDate: "", endDate: "",
    };
    updateContent({ education: [...content.education, newEdu] });
  }

  function addProject() {
    if (!content) return;
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: "", role: "", description: "", highlights: [""], techStack: [],
    };
    updateContent({ projects: [...content.projects, newProj] });
  }

  function removeItem(section: "education" | "workExperience" | "projects", index: number) {
    if (!content) return;
    updateContent({
      [section]: content[section].filter((_: unknown, i: number) => i !== index),
    });
  }

  function scoreColor(score: number) {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  }

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2 -mx-6 -mt-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
            className="h-8 w-48 border-none bg-transparent font-semibold text-sm focus-visible:ring-1 px-2"
          />
          {isDirty && !isSaving && (
            <span className="text-xs text-amber-500">未保存</span>
          )}
          {isSaving && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />保存中
            </span>
          )}
          {!isDirty && !isSaving && resumeId && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Check className="h-3 w-3" />已保存
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || !isDirty}>
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden mt-4 gap-4">
        {/* Left sidebar - section nav */}
        <div className="w-48 shrink-0 space-y-1">
          {content.sectionOrder.map((section) => {
            const Icon = sectionIcons[section] || User;
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                  activeSection === section
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sectionLabels[section] || section}
              </button>
            );
          })}
        </div>

        {/* Center - content editor */}
        <div className="flex-1 overflow-y-auto rounded-lg border bg-white p-6">
          {activeSection === "personalInfo" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">个人信息</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input value={content.personalInfo.name} onChange={(e) => updatePersonalInfo("name", e.target.value)} placeholder="张三" />
                </div>
                <div className="space-y-2">
                  <Label>电话</Label>
                  <Input value={content.personalInfo.phone || ""} onChange={(e) => updatePersonalInfo("phone", e.target.value)} placeholder="13800138000" />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input value={content.personalInfo.email || ""} onChange={(e) => updatePersonalInfo("email", e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>城市</Label>
                  <Input value={content.personalInfo.location || ""} onChange={(e) => updatePersonalInfo("location", e.target.value)} placeholder="北京" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>个人简介</Label>
                <Textarea value={content.personalInfo.summary || ""} onChange={(e) => updatePersonalInfo("summary", e.target.value)} placeholder="简短介绍你的核心优势和职业方向..." rows={4} />
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">教育背景</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-1" />添加
                </Button>
              </div>
              {content.education.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>还没有教育经历，点击上方添加</p>
                </div>
              ) : (
                content.education.map((edu, i) => (
                  <Card key={edu.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">教育经历 {i + 1}</span>
                        <Button variant="ghost" size="icon-xs" className="text-red-500" onClick={() => removeItem("education", i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">学校</Label>
                          <Input value={edu.school} onChange={(e) => { const u = [...content.education]; u[i] = { ...edu, school: e.target.value }; updateContent({ education: u }); }} placeholder="北京大学" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">专业</Label>
                          <Input value={edu.major} onChange={(e) => { const u = [...content.education]; u[i] = { ...edu, major: e.target.value }; updateContent({ education: u }); }} placeholder="计算机科学" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">学位</Label>
                          <Input value={edu.degree} onChange={(e) => { const u = [...content.education]; u[i] = { ...edu, degree: e.target.value }; updateContent({ education: u }); }} placeholder="本科" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">开始时间</Label>
                            <Input value={edu.startDate} onChange={(e) => { const u = [...content.education]; u[i] = { ...edu, startDate: e.target.value }; updateContent({ education: u }); }} placeholder="2016-09" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">结束时间</Label>
                            <Input value={edu.endDate} onChange={(e) => { const u = [...content.education]; u[i] = { ...edu, endDate: e.target.value }; updateContent({ education: u }); }} placeholder="2020-06" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeSection === "workExperience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">工作经历</h2>
                <Button variant="outline" size="sm" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4 mr-1" />添加
                </Button>
              </div>
              {content.workExperience.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>还没有工作经历，点击上方添加</p>
                </div>
              ) : (
                content.workExperience.map((exp, i) => (
                  <Card key={exp.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">工作经历 {i + 1}</span>
                        <Button variant="ghost" size="icon-xs" className="text-red-500" onClick={() => removeItem("workExperience", i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">公司</Label>
                          <Input value={exp.company} onChange={(e) => { const u = [...content.workExperience]; u[i] = { ...exp, company: e.target.value }; updateContent({ workExperience: u }); }} placeholder="字节跳动" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">职位</Label>
                          <Input value={exp.position} onChange={(e) => { const u = [...content.workExperience]; u[i] = { ...exp, position: e.target.value }; updateContent({ workExperience: u }); }} placeholder="前端开发工程师" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">工作描述</Label>
                        <Textarea value={exp.description || ""} onChange={(e) => { const u = [...content.workExperience]; u[i] = { ...exp, description: e.target.value }; updateContent({ workExperience: u }); }} placeholder="用 bullet points 描述你的主要工作内容和成果..." rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">工作亮点</Label>
                        {exp.highlights.map((h, hi) => (
                          <div key={hi} className="flex gap-2">
                            <span className="text-gray-300 mt-2">•</span>
                            <Input value={h} onChange={(e) => { const u = [...content.workExperience]; const hl = [...exp.highlights]; hl[hi] = e.target.value; u[i] = { ...exp, highlights: hl }; updateContent({ workExperience: u }); }} placeholder="描述一个具体的工作成果..." />
                          </div>
                        ))}
                        <Button variant="ghost" size="xs" onClick={() => { const u = [...content.workExperience]; u[i] = { ...exp, highlights: [...exp.highlights, ""] }; updateContent({ workExperience: u }); }}>
                          <Plus className="h-3 w-3 mr-1" />添加亮点
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeSection === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">项目经历</h2>
                <Button variant="outline" size="sm" onClick={addProject}>
                  <Plus className="h-4 w-4 mr-1" />添加
                </Button>
              </div>
              {content.projects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>还没有项目经历，点击上方添加</p>
                </div>
              ) : (
                content.projects.map((proj, i) => (
                  <Card key={proj.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">项目 {i + 1}</span>
                        <Button variant="ghost" size="icon-xs" className="text-red-500" onClick={() => removeItem("projects", i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">项目名称</Label>
                          <Input value={proj.name} onChange={(e) => { const u = [...content.projects]; u[i] = { ...proj, name: e.target.value }; updateContent({ projects: u }); }} placeholder="电商推荐系统" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">角色</Label>
                          <Input value={proj.role || ""} onChange={(e) => { const u = [...content.projects]; u[i] = { ...proj, role: e.target.value }; updateContent({ projects: u }); }} placeholder="技术负责人" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">项目描述</Label>
                        <Textarea value={proj.description || ""} onChange={(e) => { const u = [...content.projects]; u[i] = { ...proj, description: e.target.value }; updateContent({ projects: u }); }} placeholder="描述项目背景、你的角色和主要贡献..." rows={3} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">技术栈（逗号分隔）</Label>
                        <Input value={proj.techStack.join(", ")} onChange={(e) => { const u = [...content.projects]; u[i] = { ...proj, techStack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }; updateContent({ projects: u }); }} placeholder="React, TypeScript, Node.js" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeSection === "skills" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">技能特长</h2>
              <div className="space-y-2">
                <Label>技术技能（逗号分隔）</Label>
                <Textarea value={content.skills.technical.join(", ")} onChange={(e) => updateContent({ skills: { ...content.skills, technical: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} placeholder="JavaScript, TypeScript, React, Node.js, Python..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>软技能（逗号分隔）</Label>
                <Input value={content.skills.soft.join(", ")} onChange={(e) => updateContent({ skills: { ...content.skills, soft: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} placeholder="团队协作, 项目管理, 沟通表达..." />
              </div>
              <div className="space-y-2">
                <Label>证书（逗号分隔）</Label>
                <Input value={content.skills.certifications.join(", ")} onChange={(e) => updateContent({ skills: { ...content.skills, certifications: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} placeholder="AWS Solutions Architect, PMP..." />
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - tabs for AI/Preview */}
        <div className="w-80 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] pb-4">
          <Tabs value={rightTab} onValueChange={setRightTab}>
            <TabsList className="w-full">
              <TabsTrigger value="ai" className="flex-1">
                <Sparkles className="h-3.5 w-3.5 mr-1" />AI 助手
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                <Eye className="h-3.5 w-3.5 mr-1" />预览
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4 mt-3">
              {/* Score card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    AI 诊断助手
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {diagnosis ? (
                    <>
                      <div className="text-center">
                        <span className={`text-4xl font-bold ${scoreColor(diagnosis.totalScore)}`}>
                          {diagnosis.totalScore}
                        </span>
                        <span className="text-gray-400 text-lg">/100</span>
                      </div>
                      <Progress value={diagnosis.totalScore} className="h-2" />
                      <div className="space-y-1 text-xs">
                        {Object.entries(diagnosis.dimensions).map(([key, dim]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500">
                              {key === "completeness" ? "内容完整" :
                               key === "contentQuality" ? "描述质量" :
                               key === "keywords" ? "关键词" :
                               key === "formatting" ? "排版规范" : "整体印象"}
                            </span>
                            <span className={dim.level === "critical" ? "text-red-500" : dim.level === "warning" ? "text-amber-500" : ""}>
                              {dim.score}/{dim.maxScore}
                            </span>
                          </div>
                        ))}
                      </div>
                      {diagnosis.overallSummary && (
                        <p className="text-xs text-gray-500 border-t pt-2">
                          {diagnosis.overallSummary}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-2">
                      点击下方按钮开始诊断
                    </p>
                  )}
                  <Button className="w-full" size="sm" onClick={handleDiagnose} disabled={isDiagnosing}>
                    {isDiagnosing ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" />诊断中...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-1" />{diagnosis ? "重新诊断" : "开始诊断"}</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Suggestions from diagnosis */}
              {diagnosisItems.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">优化建议 ({diagnosisItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {diagnosisItems.map((item) => {
                      const config = severityConfig[item.severity] ?? severityConfig.info;
                      const SeverityIcon = config.icon;
                      return (
                        <div key={item.id} className={cn("rounded-lg p-3 text-xs space-y-2", config.bg)}>
                          <div className="flex items-center gap-1.5">
                            <SeverityIcon className={cn("h-3.5 w-3.5", config.color)} />
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">{config.label}</Badge>
                            <span className="text-gray-400">{sectionLabels[item.section] ?? item.section}</span>
                          </div>
                          <p className="text-gray-700">{item.suggestion}</p>
                          {item.rewrittenText && (
                            <Button size="xs" variant="outline" className="w-full" onClick={() => { setRewriteText(item.originalText || item.rewrittenText!); setRewriteOpen(true); }}>
                              <Sparkles className="h-3 w-3 mr-1" />一键改写
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              <ResumeCompleteness />
              <JdMatchPanel resumeContent={content} />
              <ResumeComparison />
              <InterviewQuestionGenerator />
              <AiCoverLetter />
            </TabsContent>

            <TabsContent value="preview" className="mt-3">
              <ResumePreview content={content} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Rewrite Dialog */}
      <RewriteDialog
        open={rewriteOpen}
        onOpenChange={setRewriteOpen}
        originalText={rewriteText}
        onAdopt={(text) => {
          toast.success("已采纳改写内容");
        }}
      />
    </div>
  );
}
