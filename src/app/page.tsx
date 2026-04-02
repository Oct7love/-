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
      <div className="text-[56px] font-bold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] leading-none">
        {score}
      </div>
      <div className="text-[13px] text-[#86868b]">综合评分</div>
      <div className="space-y-2.5">
        {[
          { label: "内容完整", value: 90 },
          { label: "描述质量", value: 67 },
          { label: "关键词", value: 60 },
          { label: "排版规范", value: 87 },
          { label: "整体印象", value: 60 },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-3 text-[12px]">
            <span className="w-14 text-right text-[#86868b]">{d.label}</span>
            <div className="flex-1 h-1.5 bg-[#e8e8ed] dark:bg-[#38383a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${d.value}%`,
                  backgroundColor:
                    d.value >= 80
                      ? "#34c759"
                      : d.value >= 60
                        ? "#ff9f0a"
                        : "#ff3b30",
                }}
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
      <div className="rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] p-4 text-[14px] text-[#86868b] line-through decoration-[#ff3b30]/40">
        负责前端性能优化，做了一些提升
      </div>
      <div className="flex justify-center">
        <Sparkles className="h-5 w-5 text-[#0071e3] animate-pulse" />
      </div>
      <div
        className={`rounded-xl bg-[#e3f2fd] dark:bg-[#1a3a5c] p-4 text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] transition-all duration-700 ${
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
        <span className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          匹配度
        </span>
        <span className="text-[28px] font-bold text-[#ff9f0a]">68%</span>
      </div>
      <div className="h-2 bg-[#e8e8ed] dark:bg-[#38383a] rounded-full overflow-hidden">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#ff9f0a] to-[#34c759]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] font-medium text-[#34c759] mb-1.5">
            已匹配
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["React", "TS", "性能优化"].map((k) => (
              <span
                key={k}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#34c759]/10 text-[#248a3d] dark:text-[#30d158]"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-[#ff3b30] mb-1.5">
            缺失
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["SSR", "CI/CD"].map((k) => (
              <span
                key={k}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] dark:text-[#ff453a]"
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
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#111111]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-28 pb-8 text-center bg-[#fbfbfd] dark:bg-[#111111]">
          <div className="mx-auto max-w-[980px] px-4">
            <p className="text-[14px] text-[#0071e3] font-medium mb-3">
              注册即享 7 天 Pro · 无限 AI 对话
            </p>
            <h1 className="text-[48px] leading-[1.05] font-semibold tracking-[-0.003em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-[56px]">
              让简历
              <br />
              精准传达你的价值
            </h1>
            <p className="mt-4 text-[21px] text-[#86868b] max-w-[600px] mx-auto leading-relaxed">
              AI 驱动的简历优化平台
              <br className="hidden sm:block" />
              诊断、改写、匹配，一站完成。
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-7 py-3 text-[17px] text-white hover:bg-[#0077ED] transition-colors"
              >
                免费开始
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-0.5 text-[17px] text-[#0071e3] hover:underline transition-all"
              >
                了解更多
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Product preview */}
        <section className="pb-16 bg-[#fbfbfd] dark:bg-[#111111]">
          <div className="mx-auto max-w-[740px] px-4">
            <div className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a] shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#d2d2d7]/40 dark:border-[#38383a]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center text-[11px] text-[#86868b]">
                  Oct7 — 简历编辑器
                </div>
              </div>
              <div className="flex h-[220px]">
                <div className="w-36 border-r border-[#d2d2d7]/30 dark:border-[#38383a] p-3 space-y-1 bg-[#f5f5f7] dark:bg-[#2c2c2e]">
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
                          ? "bg-[#0071e3] text-white font-medium"
                          : "text-[#86868b]"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-2.5">
                  <div className="h-2.5 w-16 rounded bg-[#e8e8ed] dark:bg-[#38383a]" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e]" />
                    <div className="h-8 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e]" />
                  </div>
                  <div className="h-2.5 w-12 rounded bg-[#e8e8ed] dark:bg-[#38383a] mt-2" />
                  <div className="h-16 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#d2d2d7]/30 dark:border-[#38383a]" />
                </div>
                <div className="w-44 border-l border-[#d2d2d7]/30 dark:border-[#38383a] p-3 space-y-2 bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#34c759]">78</div>
                    <div className="text-[9px] text-[#86868b]">/100</div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#e8e8ed] dark:bg-[#48484a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#34c759]"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-[#ff3b30]/8 text-[#ff3b30]">
                      缺少量化数据
                    </div>
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-[#ff9f0a]/8 text-[#ff9f0a]">
                      关键词不足
                    </div>
                    <div className="text-[10px] px-2 py-1.5 rounded-lg bg-[#34c759]/8 text-[#34c759]">
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
                  ? "bg-white dark:bg-[#1d1d1f]"
                  : "bg-[#f5f5f7] dark:bg-[#111111]"
              }`}
            >
              <div className="mx-auto max-w-[980px] px-4">
                <div
                  className={`flex flex-col ${
                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-12 items-center`}
                >
                  <div className="flex-1 space-y-4">
                    <p className="text-[14px] font-medium text-[#0071e3]">
                      {f.subtitle}
                    </p>
                    <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
                      {f.title}
                    </h2>
                    <p className="text-[17px] text-[#86868b] leading-relaxed">
                      {f.description}
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center text-[#0071e3] text-[17px] font-medium hover:underline"
                    >
                      立即体验
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a] shadow-sm p-8">
                      {f.demo}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="py-20 bg-[#f5f5f7] dark:bg-[#111111]">
          <div className="mx-auto max-w-[980px] px-4">
            <h2 className="text-center text-[40px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              选择适合你的方案
            </h2>
            <p className="text-center text-[17px] text-[#86868b] mt-3">
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
                  className={`rounded-2xl p-8 transition-all ${
                    plan.hl
                      ? "bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-xl scale-[1.02]"
                      : "bg-white dark:bg-[#1c1c1e] border border-[#d2d2d7]/60 dark:border-[#38383a]"
                  }`}
                >
                  {plan.hl && (
                    <div className="inline-block rounded-full bg-[#0071e3] px-3 py-1 text-[12px] text-white mb-4">
                      推荐
                    </div>
                  )}
                  <h3
                    className={`text-[17px] font-semibold ${
                      plan.hl
                        ? ""
                        : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-[40px] font-semibold leading-none">
                      ¥{plan.price}
                    </span>
                    {plan.price !== "0" && (
                      <span
                        className={
                          plan.hl
                            ? "text-gray-400 dark:text-[#86868b]"
                            : "text-[#86868b]"
                        }
                      >
                        /月
                      </span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check
                          className={`h-4 w-4 ${
                            plan.hl
                              ? "text-[#0071e3] dark:text-[#0071e3]"
                              : "text-[#34c759]"
                          }`}
                        />
                        <span
                          className={`text-[14px] ${
                            plan.hl
                              ? "text-gray-300 dark:text-[#6e6e73]"
                              : "text-[#6e6e73]"
                          }`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-8 block w-full text-center rounded-xl py-3 text-[15px] font-medium transition-all ${
                      plan.hl
                        ? "bg-[#0071e3] text-white hover:bg-[#0077ED]"
                        : "bg-[#0071e3] text-white hover:bg-[#0077ED]"
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
        <section className="py-20 text-center bg-white dark:bg-[#1d1d1f]">
          <div className="mx-auto max-w-[600px] px-4">
            <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              准备好了吗？
            </h2>
            <p className="mt-3 text-[17px] text-[#86868b]">
              免费开始，30 秒获得专业诊断
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-8 py-3.5 text-[17px] text-white hover:bg-[#0077ED] transition-colors"
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
