"use client";

import { useState } from "react";
import { ChevronDown, Search, Sparkles, Target, Palette, Upload, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    title: "入门指南",
    icon: FileText,
    items: [
      {
        q: "如何开始使用 ResumeBoost？",
        a: "注册账户后，你可以通过三种方式创建简历：上传已有的 PDF/Word 文件让 AI 自动解析、在线分模块填写、或从模板开始。创建完成后即可使用 AI 诊断和改写功能。",
      },
      {
        q: "支持哪些文件格式？",
        a: "目前支持 PDF、DOCX（Word）和 TXT 纯文本格式。文件大小限制为 10MB。上传后 AI 会自动提取和结构化简历内容。",
      },
      {
        q: "AI 解析的准确率如何？",
        a: "对标准格式的简历，解析准确率约 90%。解析完成后你可以在编辑器中检查和修正。如果解析效果不理想，也可以切换到在线填写模式。",
      },
    ],
  },
  {
    title: "AI 功能",
    icon: Sparkles,
    items: [
      {
        q: "AI 诊断是怎么评分的？",
        a: "AI 从五个维度评估你的简历：内容完整性（20分）、描述质量（30分）、关键词覆盖（20分）、排版规范（15分）、整体印象（15分），满分100分。每个维度都会给出具体的改进建议。",
      },
      {
        q: "AI 改写会编造不存在的经历吗？",
        a: "不会。AI 改写严格基于你提供的内容进行表达优化，不会虚构数据或经历。但建议你在采纳改写后仔细检查，确保内容准确。",
      },
      {
        q: "改写有哪些风格可选？",
        a: "三种风格：专业正式（适合金融、法律等）、简洁有力（适合互联网、技术等）、创意表达（适合设计、营销等）。每次改写还可以重新生成获取不同版本。",
      },
    ],
  },
  {
    title: "JD 匹配",
    icon: Target,
    items: [
      {
        q: "JD 匹配分析是什么？",
        a: "你可以粘贴目标岗位的职位描述（JD），AI 会逐项分析你的简历与 JD 的匹配度，列出已匹配和缺失的关键词，并给出针对性的优化建议。",
      },
      {
        q: "匹配度多少算好？",
        a: "一般来说，80%以上表示匹配度很高；60-80%表示基本匹配但有提升空间；60%以下建议根据建议大幅调整简历。",
      },
    ],
  },
  {
    title: "模板与导出",
    icon: Palette,
    items: [
      {
        q: "有多少套模板可选？",
        a: "目前提供 16 套模板，覆盖科技/IT、商务/金融、设计/创意、教育/学术、医疗/健康、通用等多个行业。免费版可使用 2 套基础模板，专业版可使用全部模板。",
      },
      {
        q: "导出的 PDF 能通过 ATS 筛选吗？",
        a: "可以。我们的模板经过 ATS（自动简历筛选系统）兼容性测试，导出的 PDF 文字可被系统正确提取和解析。",
      },
    ],
  },
  {
    title: "账户与付费",
    icon: Download,
    items: [
      {
        q: "免费版有什么限制？",
        a: "免费版每月可使用 3 次 AI 诊断和 3 次 AI 改写，最多创建 3 份简历，可使用 2 套基础模板。额度每月 1 日重置。",
      },
      {
        q: "可以随时取消订阅吗？",
        a: "可以。取消后将在当前计费周期结束后失效，降级为免费版。已有的简历和数据不会丢失。",
      },
      {
        q: "我的数据安全吗？",
        a: "是的，所有数据加密传输和存储，不会用于模型训练。你可以随时在设置中导出或删除所有数据。",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    const next = new Set(openItems);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOpenItems(next);
  };

  const filteredCategories = search
    ? faqCategories.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : faqCategories;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">帮助中心</h1>
        <p className="mt-2 text-gray-500">
          找到你需要的答案
        </p>
      </div>

      <div className="mt-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索问题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      <div className="mt-10 space-y-8">
        {filteredCategories.map((cat) => (
          <div key={cat.title}>
            <div className="flex items-center gap-2 mb-3">
              <cat.icon className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-semibold">{cat.title}</h2>
            </div>
            <div className="space-y-2">
              {cat.items.map((item) => {
                const key = `${cat.title}-${item.q}`;
                const isOpen = openItems.has(key);
                return (
                  <div key={key} className="rounded-xl border">
                    <button
                      onClick={() => toggleItem(key)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      {item.q}
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
