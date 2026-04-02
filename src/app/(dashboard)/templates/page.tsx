"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Check, Eye, Lock, Sparkles, Download, Users, Loader2 } from "lucide-react";

const categories = [
  { id: "all", label: "全部", count: 16 },
  { id: "tech", label: "科技/IT", count: 4 },
  { id: "business", label: "商务/金融", count: 3 },
  { id: "creative", label: "设计/创意", count: 3 },
  { id: "education", label: "教育/学术", count: 2 },
  { id: "medical", label: "医疗/健康", count: 2 },
  { id: "general", label: "通用", count: 2 },
];

const templates = [
  {
    id: "1", name: "极简清新", category: "general",
    desc: "干净简洁的单栏布局，适合所有行业",
    primary: "#059669", accent: "#d1fae5", isPremium: false, usage: 4520,
    tags: ["ATS 友好", "单栏"],
  },
  {
    id: "2", name: "技术极客", category: "tech",
    desc: "突出技术栈和项目经验，程序员首选",
    primary: "#0891b2", accent: "#cffafe", isPremium: false, usage: 3810,
    tags: ["技能优先", "GitHub 风"],
  },
  {
    id: "3", name: "产品经理", category: "tech",
    desc: "突出数据驱动和项目成果，PM 专属",
    primary: "#7c3aed", accent: "#ede9fe", isPremium: true, usage: 2960,
    tags: ["数据导向", "现代"],
  },
  {
    id: "4", name: "商务精英", category: "business",
    desc: "正式大气的金融商务风，管理层适用",
    primary: "#1e3a5f", accent: "#dbeafe", isPremium: false, usage: 2740,
    tags: ["专业", "深色头部"],
  },
  {
    id: "5", name: "投行咨询", category: "business",
    desc: "极简精炼，投行/咨询公司标准格式",
    primary: "#111827", accent: "#f3f4f6", isPremium: true, usage: 2180,
    tags: ["超简洁", "无色彩"],
  },
  {
    id: "6", name: "创意设计师", category: "creative",
    desc: "展示设计美感，视觉设计师专属",
    primary: "#ec4899", accent: "#fce7f3", isPremium: true, usage: 1820,
    tags: ["双栏", "作品集"],
  },
  {
    id: "7", name: "UI/UX 设计", category: "creative",
    desc: "界面设计师模板，现代感十足",
    primary: "#f97316", accent: "#ffedd5", isPremium: true, usage: 1560,
    tags: ["渐变", "现代"],
  },
  {
    id: "8", name: "学术科研", category: "education",
    desc: "发表论文和科研经历突出展示",
    primary: "#1f2937", accent: "#f9fafb", isPremium: false, usage: 1340,
    tags: ["学术格式", "严谨"],
  },
  {
    id: "9", name: "教师模板", category: "education",
    desc: "教学经历和教育成果展示",
    primary: "#0369a1", accent: "#e0f2fe", isPremium: true, usage: 980,
    tags: ["教育专属", "清爽"],
  },
  {
    id: "10", name: "医疗护理", category: "medical",
    desc: "医生/护士专业简历模板",
    primary: "#0d9488", accent: "#ccfbf1", isPremium: true, usage: 860,
    tags: ["资质突出", "医疗蓝"],
  },
  {
    id: "11", name: "药剂研发", category: "medical",
    desc: "制药/生物科技研发岗位模板",
    primary: "#4f46e5", accent: "#eef2ff", isPremium: true, usage: 640,
    tags: ["研发导向", "简洁"],
  },
  {
    id: "12", name: "数据分析师", category: "tech",
    desc: "数据分析和可视化能力展示",
    primary: "#2563eb", accent: "#dbeafe", isPremium: true, usage: 2100,
    tags: ["数据可视化", "图表风"],
  },
  {
    id: "13", name: "AI 工程师", category: "tech",
    desc: "机器学习/AI 领域专属模板",
    primary: "#8b5cf6", accent: "#f5f3ff", isPremium: true, usage: 1780,
    tags: ["论文发表", "深色"],
  },
  {
    id: "14", name: "市场营销", category: "creative",
    desc: "突出营销数据和品牌成果",
    primary: "#e11d48", accent: "#ffe4e6", isPremium: true, usage: 1420,
    tags: ["增长数据", "活力"],
  },
  {
    id: "15", name: "金融分析", category: "business",
    desc: "CFA/金融分析师风格模板",
    primary: "#854d0e", accent: "#fef9c3", isPremium: true, usage: 920,
    tags: ["金色调", "数据表格"],
  },
  {
    id: "16", name: "应届生通用", category: "general",
    desc: "实习经历和校园活动突出展示",
    primary: "#16a34a", accent: "#dcfce7", isPremium: false, usage: 5200,
    tags: ["入门级", "简洁"],
  },
];

function TemplatePreviewMock({
  primary,
  accent,
  variant = 0,
}: {
  primary: string;
  accent: string;
  variant?: number;
}) {
  if (variant % 3 === 1) {
    return (
      <div className="h-full flex">
        <div className="w-[35%] p-3" style={{ backgroundColor: primary }}>
          <div className="w-8 h-8 rounded-full bg-white/30 mb-3" />
          <div className="h-1.5 w-12 bg-white/50 rounded mb-1" />
          <div className="h-1 w-10 bg-white/30 rounded mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-1 w-8 bg-white/40 rounded mb-0.5" />
                <div className="h-0.5 w-full bg-white/20 rounded" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 px-1 rounded-full bg-white/20 text-[5px]" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="h-2 w-20 rounded" style={{ backgroundColor: primary }} />
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-4/5 rounded bg-gray-100" />
          <div className="h-2 w-14 rounded mt-2" style={{ backgroundColor: primary }} />
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-3/4 rounded bg-gray-100" />
          <div className="h-1 w-5/6 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (variant % 3 === 2) {
    return (
      <div className="h-full">
        <div className="p-3 pb-2" style={{ backgroundColor: primary }}>
          <div className="h-2.5 w-20 bg-white/80 rounded" />
          <div className="h-1 w-32 bg-white/40 rounded mt-1" />
        </div>
        <div className="p-3 space-y-2">
          <div className="flex gap-1 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 px-2 rounded-full text-[5px]" style={{ backgroundColor: accent, color: primary }} />
            ))}
          </div>
          <div className="h-1.5 w-14 rounded" style={{ backgroundColor: primary }} />
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-4/5 rounded bg-gray-100" />
          <div className="h-1.5 w-14 rounded mt-1" style={{ backgroundColor: primary }} />
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-3/4 rounded bg-gray-100" />
          <div className="h-1 w-5/6 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-3 space-y-2">
      <div className="text-center mb-2">
        <div className="h-2.5 w-16 mx-auto rounded" style={{ backgroundColor: primary }} />
        <div className="h-1 w-28 mx-auto rounded bg-gray-200 mt-1" />
      </div>
      <div className="h-px w-full" style={{ backgroundColor: primary, opacity: 0.2 }} />
      <div className="h-1.5 w-12 rounded" style={{ backgroundColor: primary }} />
      <div className="h-1 w-full rounded bg-gray-100" />
      <div className="h-1 w-4/5 rounded bg-gray-100" />
      <div className="h-1.5 w-12 rounded mt-1" style={{ backgroundColor: primary }} />
      <div className="h-1 w-full rounded bg-gray-100" />
      <div className="h-1 w-3/4 rounded bg-gray-100" />
      <div className="h-1 w-5/6 rounded bg-gray-100" />
      <div className="flex gap-1 flex-wrap mt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 px-1.5 rounded-full text-[5px]" style={{ backgroundColor: accent, color: primary }} />
        ))}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleUseTemplate(template: (typeof templates)[0]) {
    if (template.isPremium) {
      toast.error("请先升级到专业版");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${template.name}简历`,
          sourceType: "template",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPreviewId(null);
      router.push(`/editor/${data.data.id}`);
    } catch {
      toast.error("创建失败，请重试");
    } finally {
      setCreating(false);
    }
  }

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const previewTemplate = templates.find((t) => t.id === previewId);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">模板中心</h1>
        <p className="text-gray-500 mt-1">
          {templates.length} 套专业模板，覆盖 10+ 行业和岗位
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm transition-all ${
              activeCategory === cat.id
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
            <span className={`text-xs ${activeCategory === cat.id ? "text-emerald-200" : "text-gray-400"}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((template, i) => (
          <div
            key={template.id}
            className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all hover:-translate-y-0.5"
          >
            <div className="relative aspect-[3/4] bg-white overflow-hidden">
              <div className="absolute inset-2">
                <TemplatePreviewMock
                  primary={template.primary}
                  accent={template.accent}
                  variant={i}
                />
              </div>

              {template.isPremium && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-gray-900/70 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white">
                  <Lock className="h-2.5 w-2.5" />
                  Pro
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 group-hover:bg-black/20 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => setPreviewId(template.id)}
                  className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-gray-900 hover:bg-white shadow-sm"
                >
                  <Eye className="h-3 w-3 inline mr-1" />
                  预览
                </button>
              </div>
            </div>

            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <Users className="h-2.5 w-2.5" />
                  {template.usage.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-snug">{template.desc}</p>
              <div className="flex gap-1">
                {template.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!previewId} onOpenChange={() => setPreviewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-xl border bg-white overflow-hidden">
                <TemplatePreviewMock
                  primary={previewTemplate.primary}
                  accent={previewTemplate.accent}
                  variant={parseInt(previewTemplate.id) - 1}
                />
              </div>
              <p className="text-sm text-gray-600">{previewTemplate.desc}</p>
              <div className="flex gap-1">
                {previewTemplate.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setPreviewId(null)}>
                  关闭
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleUseTemplate(previewTemplate)}
                  disabled={creating}
                >
                  {creating ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />创建中</>
                  ) : previewTemplate.isPremium ? (
                    <><Lock className="h-3 w-3 mr-1" />升级使用</>
                  ) : (
                    <><Check className="h-3 w-3 mr-1" />使用模板</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
