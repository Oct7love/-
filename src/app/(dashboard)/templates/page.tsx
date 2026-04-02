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
  const nameStyle = { color: primary, fontSize: "8px", fontWeight: 700 };
  const sectionStyle = { color: primary, fontSize: "6px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", borderBottom: `1px solid ${primary}30`, paddingBottom: "2px", marginBottom: "3px" };
  const textStyle = { fontSize: "5px", color: "#374151", lineHeight: 1.5 };
  const subStyle = { fontSize: "4.5px", color: "#6B7280" };
  const tagStyle = { fontSize: "4px", padding: "1px 3px", borderRadius: "6px", backgroundColor: accent, color: primary, display: "inline-block" };

  if (variant % 3 === 1) {
    return (
      <div className="h-full flex" style={{ fontFamily: "system-ui" }}>
        <div className="w-[35%] p-2.5" style={{ backgroundColor: primary }}>
          <div className="w-7 h-7 rounded-full bg-white/30 mx-auto mb-2" />
          <div className="text-center" style={{ fontSize: "6px", color: "white", fontWeight: 600 }}>张三</div>
          <div className="text-center" style={{ fontSize: "4px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>前端工程师</div>
          <div className="mt-3 space-y-2">
            {["138****8000", "test@qq.com", "北京"].map((t) => (
              <div key={t} style={{ fontSize: "4px", color: "rgba(255,255,255,0.5)" }}>{t}</div>
            ))}
          </div>
          <div className="mt-3">
            <div style={{ fontSize: "4.5px", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: "3px" }}>技能</div>
            <div className="flex gap-0.5 flex-wrap">
              {["React", "TS", "Node"].map((s) => (
                <span key={s} style={{ fontSize: "3.5px", padding: "1px 3px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-2.5 space-y-2">
          <div>
            <div style={sectionStyle}>工作经历</div>
            <div style={{ ...textStyle, fontWeight: 600 }}>字节跳动 · 高级前端</div>
            <div style={subStyle}>2022 - 至今</div>
            <div style={textStyle}>主导性能优化，首屏加载降至 1.8s</div>
          </div>
          <div>
            <div style={sectionStyle}>教育背景</div>
            <div style={{ ...textStyle, fontWeight: 600 }}>北京大学 · 计算机科学</div>
            <div style={subStyle}>2016 - 2020 · 本科</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant % 3 === 2) {
    return (
      <div className="h-full" style={{ fontFamily: "system-ui" }}>
        <div className="p-2.5 pb-2" style={{ backgroundColor: primary }}>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "white" }}>张三</div>
          <div style={{ fontSize: "4.5px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>5年前端开发经验，专注于性能优化</div>
          <div style={{ fontSize: "4px", color: "rgba(255,255,255,0.5)", marginTop: "3px" }}>138****8000 · test@qq.com · 北京</div>
        </div>
        <div className="p-2.5 space-y-2">
          <div className="flex gap-1 flex-wrap">
            {["React", "TypeScript", "Node.js", "Vue"].map((s) => (
              <span key={s} style={tagStyle}>{s}</span>
            ))}
          </div>
          <div>
            <div style={sectionStyle}>工作经历</div>
            <div style={{ ...textStyle, fontWeight: 600 }}>字节跳动 · 高级前端工程师</div>
            <div style={subStyle}>2022.03 - 至今</div>
            <div style={textStyle}>• 主导前端性能优化，提升 44%</div>
            <div style={textStyle}>• 搭建组件库，覆盖 50+ 场景</div>
          </div>
          <div>
            <div style={sectionStyle}>教育背景</div>
            <div style={{ ...textStyle, fontWeight: 600 }}>北京大学 · 计算机科学 · 本科</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-3 space-y-1.5" style={{ fontFamily: "system-ui" }}>
      <div className="text-center mb-2">
        <div style={nameStyle}>张三</div>
        <div style={{ fontSize: "4px", color: "#9CA3AF", marginTop: "2px" }}>138****8000 · test@qq.com · 北京</div>
        <div style={{ fontSize: "4.5px", color: "#6B7280", marginTop: "3px", maxWidth: "90%", marginLeft: "auto", marginRight: "auto" }}>5年前端经验，专注 React 性能优化</div>
      </div>
      <div className="h-px w-full" style={{ backgroundColor: primary, opacity: 0.2 }} />
      <div>
        <div style={sectionStyle}>工作经历</div>
        <div className="flex justify-between"><span style={{ ...textStyle, fontWeight: 600 }}>字节跳动</span><span style={subStyle}>2022 - 至今</span></div>
        <div style={subStyle}>高级前端工程师</div>
        <div style={textStyle}>• 首屏加载从 3.2s 降至 1.8s</div>
      </div>
      <div>
        <div style={sectionStyle}>教育背景</div>
        <div className="flex justify-between"><span style={{ ...textStyle, fontWeight: 600 }}>北京大学</span><span style={subStyle}>2016 - 2020</span></div>
        <div style={subStyle}>计算机科学 · 本科</div>
      </div>
      <div className="flex gap-0.5 flex-wrap mt-1">
        {["React", "TS", "Node"].map((s) => (
          <span key={s} style={tagStyle}>{s}</span>
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
