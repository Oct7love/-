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
  Zap,
  Shield,
  BarChart3,
  Palette,
} from "lucide-react";

function AnimatedScore() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setScore((prev) => {
        if (prev >= 78) {
          clearInterval(timer);
          return 78;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="text-[56px] font-bold tabular-nums text-emerald-500 leading-none">
        {score}
      </div>
      <div className="text-xs text-gray-400">综合评分</div>
      <div className="space-y-2.5">
        {[
          { label: "内容完整", value: 90 },
          { label: "描述质量", value: 67 },
          { label: "关键词", value: 60 },
          { label: "排版规范", value: 87 },
          { label: "整体印象", value: 60 },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-3 text-xs">
            <span className="w-14 text-right text-gray-400">{d.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  d.value >= 80
                    ? "bg-emerald-400"
                    : d.value >= 60
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
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
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-400 line-through decoration-red-300/60">
        负责前端性能优化，做了一些提升
      </div>
      <div className="flex justify-center">
        <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
      </div>
      <div
        className={`rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 p-4 text-sm text-gray-800 dark:text-gray-200 transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        主导前端性能优化项目，将首屏加载时间从{" "}
        <strong>3.2s 降至 1.8s</strong>，减少 <strong>44%</strong>
      </div>
    </div>
  );
}

function MatchDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          匹配度
        </span>
        <span className="text-2xl font-bold text-emerald-500">68%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold text-emerald-500 mb-1.5">
            已匹配
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["React", "TS", "性能优化"].map((k) => (
              <span
                key={k}
                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-red-400 mb-1.5">
            缺失
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["SSR", "CI/CD"].map((k) => (
              <span
                key={k}
                className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"
              >
                {k}
              </span>
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
    description:
      "从内容完整性、描述质量、关键词覆盖、排版规范、整体印象五个维度全面评估你的简历。",
    demo: <AnimatedScore />,
    icon: Search,
  },
  {
    title: "一键改写",
    subtitle: "让每一句都有力量",
    description:
      "AI 自动改写平淡描述，添加量化数据，使用行动动词。三种风格可选。",
    demo: <RewriteDemo />,
    icon: Sparkles,
  },
  {
    title: "JD 匹配分析",
    subtitle: "精准命中目标岗位",
    description: "粘贴目标 JD，AI 逐项分析匹配度，告诉你缺少哪些关键词。",
    demo: <MatchDemo />,
    icon: Target,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-28 pb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/20 dark:via-gray-950 dark:to-gray-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] rounded-full bg-emerald-200/30 dark:bg-emerald-500/5 blur-[120px]" />

          <div className="mx-auto max-w-[800px] px-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">
              <Sparkles className="h-3 w-3" />
              注册即享 7 天 Pro · 无限 AI 对话
            </div>
            <h1 className="text-[48px] leading-[1.08] font-bold tracking-tight text-gray-900 dark:text-white sm:text-[56px]">
              让简历
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                精准传达你的价值
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              AI 驱动的简历优化平台。诊断、改写、匹配，一站完成。
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-7 py-3 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
              >
                免费开始
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-0.5 text-base text-gray-500 hover:text-emerald-600 transition-colors"
              >
                了解更多
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6">
              {[
                { icon: Zap, label: "30 秒出结果" },
                { icon: Shield, label: "数据加密" },
                { icon: BarChart3, label: "ATS 友好" },
                { icon: Palette, label: "专业模板" },
              ].map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-1.5 text-xs text-gray-400"
                >
                  <h.icon className="h-3.5 w-3.5 text-emerald-400" />
                  {h.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product preview */}
        <section className="pb-16">
          <div className="mx-auto max-w-[740px] px-4">
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-emerald-500/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center text-[11px] text-gray-400">
                  Oct7 — 简历编辑器
                </div>
              </div>
              <div className="flex h-[220px]">
                <div className="w-36 border-r border-gray-100 dark:border-gray-800 p-3 space-y-1 bg-gray-50/50 dark:bg-gray-900/50">
                  {[
                    "个人信息",
                    "教育背景",
                    "工作经历",
                    "项目经历",
                    "技能",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg ${
                        i === 2
                          ? "bg-emerald-500 text-white font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-2.5">
                  <div className="h-2.5 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 rounded-lg bg-gray-50 dark:bg-gray-800" />
                    <div className="h-8 rounded-lg bg-gray-50 dark:bg-gray-800" />
                  </div>
                  <div className="h-2.5 w-12 rounded bg-gray-100 dark:bg-gray-800 mt-2" />
                  <div className="h-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
                </div>
                <div className="w-44 border-l border-gray-100 dark:border-gray-800 p-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-500">78</div>
                    <div className="text-[9px] text-gray-400">/100</div>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500">
                      缺少量化数据
                    </div>
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                      关键词不足
                    </div>
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                      格式良好
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`py-20 ${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-950"
                  : "bg-gray-50 dark:bg-gray-900"
              }`}
            >
              <div className="mx-auto max-w-[980px] px-4">
                <div
                  className={`flex flex-col ${
                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-12 items-center`}
                >
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-500">
                      {f.subtitle}
                    </p>
                    <h2 className="text-[32px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                      {f.title}
                    </h2>
                    <p className="text-base text-gray-500 leading-relaxed">
                      {f.description}
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center text-emerald-500 text-sm font-semibold hover:text-emerald-600 transition-colors"
                    >
                      立即体验
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg p-8">
                      {f.demo}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-[900px] px-4">
            <h2 className="text-center text-[32px] font-bold tracking-tight text-gray-900 dark:text-white">
              选择适合你的方案
            </h2>
            <p className="text-center text-base text-gray-400 mt-2">
              从免费版开始，随时升级
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {[
                {
                  name: "免费版",
                  price: "0",
                  features: ["3 次/月 AI 诊断", "2 套模板", "PDF 导出"],
                  hl: false,
                },
                {
                  name: "专业版",
                  price: "29",
                  features: [
                    "无限 AI 诊断改写",
                    "全部模板 + JD 匹配",
                    "PDF + Word 导出",
                  ],
                  hl: true,
                },
                {
                  name: "旗舰版",
                  price: "59",
                  features: [
                    "专业版全部功能",
                    "多语言 + 优先响应",
                    "专属客服",
                  ],
                  hl: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-7 transition-all hover:scale-[1.02] ${
                    plan.hl
                      ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                      : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                  }`}
                >
                  {plan.hl && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold text-emerald-600 shadow-md">
                      推荐
                    </div>
                  )}
                  <h3
                    className={`text-base font-semibold ${
                      plan.hl ? "" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-3">
                    <span className="text-[36px] font-bold leading-none">
                      ¥{plan.price}
                    </span>
                    {plan.price !== "0" && (
                      <span
                        className={
                          plan.hl ? "text-emerald-200" : "text-gray-400"
                        }
                      >
                        /月
                      </span>
                    )}
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check
                          className={`h-4 w-4 ${
                            plan.hl ? "text-emerald-200" : "text-emerald-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            plan.hl ? "text-emerald-100" : "text-gray-500"
                          }`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-6 block w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      plan.hl
                        ? "bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg shadow-black/5"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
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
        <section className="py-20 text-center bg-gradient-to-b from-emerald-50/60 to-white dark:from-emerald-950/10 dark:to-gray-950">
          <div className="mx-auto max-w-lg px-4">
            <h2 className="text-[32px] font-bold tracking-tight text-gray-900 dark:text-white">
              准备好了吗？
            </h2>
            <p className="mt-3 text-base text-gray-500">
              免费开始，30 秒获得专业诊断
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
            >
              免费诊断我的简历
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
