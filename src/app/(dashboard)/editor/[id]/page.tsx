"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RewriteDialog } from "@/components/editor/rewrite-dialog";
import { JdMatchPanel } from "@/components/editor/jd-match-panel";
import { ResumeCompleteness } from "@/components/shared/resume-completeness";
import { AiCoverLetter } from "@/components/shared/ai-cover-letter";
import { ResumeComparison } from "@/components/shared/resume-comparison";
import { InterviewQuestionGenerator } from "@/components/shared/interview-question-generator";
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
  ChevronRight,
} from "lucide-react";
import type { ResumeContent, WorkExperience, Education, Project } from "@/types/resume";

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
  personalInfo: {
    name: "",
    phone: "",
    email: "",
    location: "",
    summary: "",
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    certifications: [],
  },
  customSections: [],
  sectionOrder: [
    "personalInfo",
    "education",
    "workExperience",
    "projects",
    "skills",
  ],
};

const severityConfig = {
  critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", label: "严重" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", label: "建议" },
  info: { icon: Info, color: "text-emerald-500", bg: "bg-emerald-50", label: "优化" },
};

export default function EditorPage() {
  const [content, setContent] = useState<ResumeContent>(defaultContent);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisScore, setDiagnosisScore] = useState<number | null>(null);
  const [rewriteOpen, setRewriteOpen] = useState(false);
  const [rewriteText, setRewriteText] = useState("");

  const mockDiagnosisItems = [
    {
      severity: "critical" as const,
      section: "workExperience",
      suggestion: "工作经历缺少量化数据，建议添加具体的提升百分比或数据指标",
      rewrittenText: "主导前端性能优化项目，将首屏加载时间从 3.2s 降至 1.8s",
    },
    {
      severity: "warning" as const,
      section: "skills",
      suggestion: "技能列表缺少行业关键词，建议补充 微服务、CI/CD 等",
      rewrittenText: null,
    },
    {
      severity: "info" as const,
      section: "personalInfo",
      suggestion: "建议个人简介更加精简有力，突出核心竞争力",
      rewrittenText: null,
    },
  ];

  function updatePersonalInfo(field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }

  function addWorkExperience() {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      highlights: [""],
    };
    setContent((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp],
    }));
  }

  function addEducation() {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
    };
    setContent((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  }

  function addProject() {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      description: "",
      highlights: [""],
      techStack: [],
    };
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  }

  function removeItem(section: "education" | "workExperience" | "projects", index: number) {
    setContent((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }

  function handleDiagnose() {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDiagnosisScore(72);
      setIsDiagnosing(false);
    }, 2000);
  }

  function scoreColor(score: number) {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-emerald-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2 -mx-6 -mt-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" })
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <span className="font-semibold">简历编辑器</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button variant="outline" size="sm">
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
                  <Input
                    value={content.personalInfo.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                    placeholder="张三"
                  />
                </div>
                <div className="space-y-2">
                  <Label>电话</Label>
                  <Input
                    value={content.personalInfo.phone || ""}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    placeholder="13800138000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input
                    value={content.personalInfo.email || ""}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>城市</Label>
                  <Input
                    value={content.personalInfo.location || ""}
                    onChange={(e) =>
                      updatePersonalInfo("location", e.target.value)
                    }
                    placeholder="北京"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>个人简介</Label>
                <Textarea
                  value={content.personalInfo.summary || ""}
                  onChange={(e) =>
                    updatePersonalInfo("summary", e.target.value)
                  }
                  placeholder="简短介绍你的核心优势和职业方向..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">教育背景</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加
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
                        <span className="text-sm font-medium text-gray-500">
                          教育经历 {i + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-red-500"
                          onClick={() => removeItem("education", i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">学校</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[i] = { ...edu, school: e.target.value };
                              setContent({ ...content, education: updated });
                            }}
                            placeholder="北京大学"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">专业</Label>
                          <Input
                            value={edu.major}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[i] = { ...edu, major: e.target.value };
                              setContent({ ...content, education: updated });
                            }}
                            placeholder="计算机科学"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">学位</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...content.education];
                              updated[i] = { ...edu, degree: e.target.value };
                              setContent({ ...content, education: updated });
                            }}
                            placeholder="本科"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">开始时间</Label>
                            <Input
                              value={edu.startDate}
                              onChange={(e) => {
                                const updated = [...content.education];
                                updated[i] = {
                                  ...edu,
                                  startDate: e.target.value,
                                };
                                setContent({ ...content, education: updated });
                              }}
                              placeholder="2016-09"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">结束时间</Label>
                            <Input
                              value={edu.endDate}
                              onChange={(e) => {
                                const updated = [...content.education];
                                updated[i] = {
                                  ...edu,
                                  endDate: e.target.value,
                                };
                                setContent({ ...content, education: updated });
                              }}
                              placeholder="2020-06"
                            />
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addWorkExperience}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加
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
                        <span className="text-sm font-medium text-gray-500">
                          工作经历 {i + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-red-500"
                          onClick={() => removeItem("workExperience", i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">公司</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...content.workExperience];
                              updated[i] = {
                                ...exp,
                                company: e.target.value,
                              };
                              setContent({
                                ...content,
                                workExperience: updated,
                              });
                            }}
                            placeholder="字节跳动"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">职位</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const updated = [...content.workExperience];
                              updated[i] = {
                                ...exp,
                                position: e.target.value,
                              };
                              setContent({
                                ...content,
                                workExperience: updated,
                              });
                            }}
                            placeholder="前端开发工程师"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">工作描述</Label>
                        <Textarea
                          value={exp.description || ""}
                          onChange={(e) => {
                            const updated = [...content.workExperience];
                            updated[i] = {
                              ...exp,
                              description: e.target.value,
                            };
                            setContent({
                              ...content,
                              workExperience: updated,
                            });
                          }}
                          placeholder="用 bullet points 描述你的主要工作内容和成果..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">工作亮点</Label>
                        {exp.highlights.map((h, hi) => (
                          <div key={hi} className="flex gap-2">
                            <span className="text-gray-300 mt-2">•</span>
                            <Input
                              value={h}
                              onChange={(e) => {
                                const updated = [...content.workExperience];
                                const highlights = [...exp.highlights];
                                highlights[hi] = e.target.value;
                                updated[i] = { ...exp, highlights };
                                setContent({
                                  ...content,
                                  workExperience: updated,
                                });
                              }}
                              placeholder="描述一个具体的工作成果..."
                            />
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            const updated = [...content.workExperience];
                            updated[i] = {
                              ...exp,
                              highlights: [...exp.highlights, ""],
                            };
                            setContent({
                              ...content,
                              workExperience: updated,
                            });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          添加亮点
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
                  <Plus className="h-4 w-4 mr-1" />
                  添加
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
                        <span className="text-sm font-medium text-gray-500">
                          项目 {i + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-red-500"
                          onClick={() => removeItem("projects", i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">项目名称</Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => {
                              const updated = [...content.projects];
                              updated[i] = { ...proj, name: e.target.value };
                              setContent({ ...content, projects: updated });
                            }}
                            placeholder="电商推荐系统"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">角色</Label>
                          <Input
                            value={proj.role || ""}
                            onChange={(e) => {
                              const updated = [...content.projects];
                              updated[i] = { ...proj, role: e.target.value };
                              setContent({ ...content, projects: updated });
                            }}
                            placeholder="技术负责人"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">项目描述</Label>
                        <Textarea
                          value={proj.description || ""}
                          onChange={(e) => {
                            const updated = [...content.projects];
                            updated[i] = {
                              ...proj,
                              description: e.target.value,
                            };
                            setContent({ ...content, projects: updated });
                          }}
                          placeholder="描述项目背景、你的角色和主要贡献..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">技术栈（逗号分隔）</Label>
                        <Input
                          value={proj.techStack.join(", ")}
                          onChange={(e) => {
                            const updated = [...content.projects];
                            updated[i] = {
                              ...proj,
                              techStack: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            setContent({ ...content, projects: updated });
                          }}
                          placeholder="React, TypeScript, Node.js"
                        />
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
                <Textarea
                  value={content.skills.technical.join(", ")}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      skills: {
                        ...content.skills,
                        technical: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="JavaScript, TypeScript, React, Node.js, Python..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>软技能（逗号分隔）</Label>
                <Input
                  value={content.skills.soft.join(", ")}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      skills: {
                        ...content.skills,
                        soft: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="团队协作, 项目管理, 沟通表达..."
                />
              </div>
              <div className="space-y-2">
                <Label>证书（逗号分隔）</Label>
                <Input
                  value={content.skills.certifications.join(", ")}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      skills: {
                        ...content.skills,
                        certifications: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="AWS Solutions Architect, PMP..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - AI assistant */}
        <div className="w-72 shrink-0 overflow-y-auto space-y-4 max-h-[calc(100vh-8rem)] pb-4">
          {/* Score card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                AI 诊断助手
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diagnosisScore !== null ? (
                <>
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${scoreColor(diagnosisScore)}`}>
                      {diagnosisScore}
                    </span>
                    <span className="text-gray-400 text-lg">/100</span>
                  </div>
                  <Progress value={diagnosisScore} className="h-2" />
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">内容完整</span>
                      <span>18/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">描述质量</span>
                      <span className="text-amber-500">20/30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">关键词</span>
                      <span className="text-amber-500">12/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">排版规范</span>
                      <span>13/15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">整体印象</span>
                      <span>9/15</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  点击下方按钮开始诊断
                </p>
              )}
              <Button
                className="w-full"
                size="sm"
                onClick={handleDiagnose}
                disabled={isDiagnosing}
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    诊断中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {diagnosisScore !== null ? "重新诊断" : "开始诊断"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {diagnosisScore !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  优化建议 ({mockDiagnosisItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockDiagnosisItems.map((item, i) => {
                  const config = severityConfig[item.severity];
                  const SeverityIcon = config.icon;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg p-3 text-xs space-y-2",
                        config.bg
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <SeverityIcon className={cn("h-3.5 w-3.5", config.color)} />
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {config.label}
                        </Badge>
                        <span className="text-gray-400">
                          {sectionLabels[item.section]}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.suggestion}</p>
                      {item.rewrittenText && (
                        <Button
                          size="xs"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setRewriteText(item.rewrittenText!);
                            setRewriteOpen(true);
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          一键改写
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Completeness check */}
          <ResumeCompleteness />

          {/* JD Match Panel */}
          <JdMatchPanel resumeContent={content} />

          {/* Version Comparison */}
          <ResumeComparison />

          {/* Interview Questions */}
          <InterviewQuestionGenerator />

          {/* Cover Letter Generator */}
          <AiCoverLetter />
        </div>
      </div>

      {/* Rewrite Dialog */}
      <RewriteDialog
        open={rewriteOpen}
        onOpenChange={setRewriteOpen}
        originalText={rewriteText}
        onAdopt={(text) => {
          console.log("Adopted:", text);
        }}
      />
    </div>
  );
}
