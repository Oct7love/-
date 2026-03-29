"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  ArrowRight,
  ChevronRight,
  Check,
  Sparkles,
  Search,
  Target,
  Palette,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

function AnimatedScore() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setScore((prev) => (prev >= 78 ? 78 : prev + 1));
    }, 25);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-3">
      <div className="text-[56px] font-bold tabular-nums text-emerald-600 leading-none">{score}</div>
      <div className="text-sm text-gray-400">综合评分</div>
      <div className="space-y-2">
        {[
          { label: "内容完整", value: 90 },
          { label: "描述质量", value: 67 },
          { label: "关键词", value: 60 },
          { label: "排版规范", value: 87 },
          { label: "整体印象", value: 60 },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="w-14 text-right text-gray-500">{d.label}</span>
            <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${d.value >= 80 ? "bg-emerald-400" : d.value >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${d.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewriteDemo() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 800); }, []);
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 p-3 text-sm text-gray-400 line-through decoration-red-300/60">
        负责前端性能优化，做了一些提升
      </div>
      <div className="flex justify-center">
        <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
      </div>
      <div className={`rounded-xl bg-emerald-500/10 backdrop-blur-sm border border-emerald-300/30 p-3 text-sm text-gray-800 transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        主导前端性能优化项目，将首屏加载时间从 <strong>3.2s 降至 1.8s</strong>，减少 <strong>44%</strong>
      </div>
    </div>
  );
}

function MatchDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">匹配度</span>
        <span className="text-2xl font-bold text-emerald-600">68%</span>
      </div>
      <div className="h-2 bg-white/40 rounded-full overflow-hidden">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] font-medium text-emerald-600 mb-1">已匹配</div>
          <div className="flex gap-1 flex-wrap">
            {["React", "TS", "性能优化"].map((k) => (
              <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 backdrop-blur-sm text-emerald-700 border border-emerald-200/50">{k}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium text-red-500 mb-1">缺失</div>
          <div className="flex gap-1 flex-wrap">
            {["SSR", "CI/CD"].map((k) => (
              <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 backdrop-blur-sm text-red-500 border border-red-200/50">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "AI 智能诊断",
    subtitle: "五维度专业评分",
    description: "从内容完整性、描述质量、关键词覆盖、排版规范、整体印象五个维度全面评估你的简历。",
    demo: <AnimatedScore />,
    gradient: "from-emerald-200/40 via-teal-100/30 to-cyan-100/20",
    iconGradient: "from-emerald-400 to-teal-500",
    icon: Search,
  },
  {
    title: "一键改写",
    subtitle: "让每一句都有力量",
    description: "AI 自动改写平淡描述，添加量化数据，使用行动动词。三种风格可选。",
    demo: <RewriteDemo />,
    gradient: "from-green-200/40 via-emerald-100/30 to-teal-100/20",
    iconGradient: "from-green-400 to-emerald-500",
    icon: Sparkles,
  },
  {
    title: "JD 匹配分析",
    subtitle: "精准命中目标岗位",
    description: "粘贴目标 JD，AI 逐项分析匹配度，告诉你缺少哪些关键词。",
    demo: <MatchDemo />,
    gradient: "from-teal-200/40 via-cyan-100/30 to-sky-100/20",
    iconGradient: "from-teal-400 to-cyan-500",
    icon: Target,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Navbar />

      {/* Floating orbs background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-green-100/25 rounded-full blur-3xl" />
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-4 text-center">
          <div className="mx-auto max-w-[980px] px-4">
            <div className="inline-flex items-center gap-1.5 rounded-full liquid-glass px-3.5 py-1.5 text-xs text-emerald-700 mb-5" style={{borderRadius: '9999px'}}>
              <Sparkles className="h-3 w-3" />
              AI 驱动 · 已帮助 10,000+ 求职者
            </div>
            <h1 className="text-[48px] leading-[1.08] font-semibold tracking-[-0.003em] text-gray-900 sm:text-[64px]">
              让简历
              <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent">
                精准传达你的价值
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-lg mx-auto">
              AI 驱动的简历优化平台。诊断、改写、匹配，一站完成。
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-6 py-2.5 text-base text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02]"
              >
                免费开始
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-0.5 rounded-full liquid-glass px-5 py-2.5 text-base text-gray-700 hover:bg-white/30 transition-all" style={{borderRadius: '9999px'}}
              >
                了解更多
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6">
              {[
                { icon: Zap, label: "30 秒出结果" },
                { icon: Shield, label: "数据加密" },
                { icon: BarChart3, label: "ATS 友好" },
                { icon: Palette, label: "专业模板" },
              ].map((h) => (
                <div key={h.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <h.icon className="h-3.5 w-3.5" />
                  {h.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product preview — glass card */}
        <section className="pb-10">
          <div className="mx-auto max-w-[780px] px-4">
            <div className="liquid-glass p-1.5">
              <div className="rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden border border-white/50">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200/40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                </div>
                <div className="flex h-[220px]">
                  <div className="w-36 border-r border-gray-200/30 p-3 space-y-1.5 bg-white/30">
                    {["个人信息", "教育背景", "工作经历", "项目经历", "技能"].map((item, i) => (
                      <div key={item} className={`text-[10px] px-2.5 py-1 rounded-lg ${i === 2 ? "bg-emerald-500/15 text-emerald-700 font-medium backdrop-blur-sm" : "text-gray-400"}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-4 space-y-2">
                    <div className="h-2.5 w-16 rounded bg-gray-200/60" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-7 rounded-lg bg-gray-100/60" />
                      <div className="h-7 rounded-lg bg-gray-100/60" />
                    </div>
                    <div className="h-2.5 w-12 rounded bg-gray-200/60 mt-2" />
                    <div className="h-16 rounded-lg bg-gray-50/60 border border-gray-200/30" />
                  </div>
                  <div className="w-44 border-l border-gray-200/30 p-3 space-y-2 bg-white/30">
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">78</div>
                      <div className="text-[9px] text-gray-400">/100</div>
                      <div className="mt-1 h-1 rounded-full bg-gray-200/50 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: "78%" }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] px-2 py-1 rounded-lg bg-red-500/10 backdrop-blur-sm text-red-500 border border-red-200/30">缺少量化数据</div>
                      <div className="text-[9px] px-2 py-1 rounded-lg bg-amber-500/10 backdrop-blur-sm text-amber-600 border border-amber-200/30">关键词不足</div>
                      <div className="text-[9px] px-2 py-1 rounded-lg bg-emerald-500/10 backdrop-blur-sm text-emerald-600 border border-emerald-200/30">格式良好</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features with glass demos */}
        <section id="features" className="py-10">
          <div className="mx-auto max-w-[980px] px-4 space-y-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`liquid-glass-tinted p-8 md:p-10`}
              >
                <div className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
                  <div className="flex-1 space-y-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${f.iconGradient} shadow-lg shadow-emerald-400/20`}>
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-emerald-600">{f.subtitle}</p>
                    <h3 className="text-[28px] font-semibold tracking-tight text-gray-900">{f.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{f.description}</p>
                    <Link href="/register" className="inline-flex items-center text-emerald-600 text-sm font-medium">
                      立即体验 <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Link>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="liquid-glass p-6">
                      {f.demo}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing — glass cards */}
        <section className="py-14">
          <div className="mx-auto max-w-[800px] px-4">
            <h2 className="text-center text-[32px] font-semibold tracking-tight text-gray-900">
              选择方案
            </h2>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { name: "免费版", price: "0", features: ["3 次/月 AI 诊断", "2 套模板", "PDF 导出"], hl: false },
                { name: "专业版", price: "29", features: ["无限 AI 诊断改写", "全部模板 + JD 匹配", "PDF + Word 导出"], hl: true },
                { name: "旗舰版", price: "59", features: ["专业版全部功能", "多语言 + 优先响应", "专属客服"], hl: false },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-6 transition-all hover:scale-[1.02] ${
                    plan.hl
                      ? "liquid-glass-dark text-white"
                      : "liquid-glass"
                  }`}
                >
                  {plan.hl && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-0.5 text-[10px] text-white shadow-lg shadow-emerald-400/30">推荐</div>
                  )}
                  <h3 className="text-base font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-[36px] font-semibold leading-none">¥{plan.price}</span>
                    {plan.price !== "0" && <span className={plan.hl ? "text-gray-400" : "text-gray-500"}>/月</span>}
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className={`h-3.5 w-3.5 ${plan.hl ? "text-emerald-400" : "text-emerald-500"}`} />
                        <span className={`text-xs ${plan.hl ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-5 block w-full text-center rounded-full py-2 text-sm font-medium transition-all ${
                      plan.hl
                        ? "bg-white text-gray-900 shadow-lg shadow-white/20 hover:shadow-white/30"
                        : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700"
                    }`}
                  >
                    {plan.price === "0" ? "免费开始" : "升级"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 text-center">
          <div className="mx-auto max-w-lg">
            <div className="liquid-glass p-10">
              <h2 className="text-[32px] font-semibold tracking-tight text-gray-900">
                准备好了吗？
              </h2>
              <p className="mt-2 text-gray-500">免费开始，30 秒获得专业诊断</p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-7 py-3 text-base text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02]"
              >
                免费诊断我的简历
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
