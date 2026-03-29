"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, HelpCircle } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "免费版",
    monthly: 0,
    yearly: 0,
    description: "体验核心功能，开始优化你的简历",
    features: [
      { text: "每月 3 次 AI 诊断", included: true },
      { text: "每月 3 次 AI 改写", included: true },
      { text: "2 套基础模板", included: true },
      { text: "PDF 导出", included: true },
      { text: "最多 3 份简历", included: true },
      { text: "JD 匹配分析", included: false },
      { text: "Word 导出", included: false },
      { text: "版本历史", included: false },
    ],
    cta: "免费开始",
    popular: false,
  },
  {
    name: "专业版",
    monthly: 29,
    yearly: 249,
    description: "求职路上的最佳助手",
    features: [
      { text: "无限 AI 诊断与改写", included: true },
      { text: "全部简历模板", included: true },
      { text: "JD 匹配分析", included: true },
      { text: "PDF + Word 导出", included: true },
      { text: "无限简历数量", included: true },
      { text: "完整版本历史", included: true },
      { text: "多语言简历", included: false },
      { text: "优先 AI 响应", included: false },
    ],
    cta: "升级专业版",
    popular: true,
  },
  {
    name: "旗舰版",
    monthly: 59,
    yearly: 499,
    description: "全方位求职加速",
    features: [
      { text: "专业版全部功能", included: true },
      { text: "多语言简历（中/英）", included: true },
      { text: "优先 AI 响应", included: true },
      { text: "专属客服支持", included: true },
      { text: "高级简历分析报告", included: true },
      { text: "求职追踪（即将推出）", included: true },
    ],
    cta: "选择旗舰版",
    popular: false,
  },
];

const faqs = [
  {
    q: "免费版有什么限制？",
    a: "免费版每月可使用 3 次 AI 诊断和 3 次 AI 改写，最多创建 3 份简历，可使用 2 套基础模板。额度每月 1 日重置。",
  },
  {
    q: "可以随时取消订阅吗？",
    a: "可以。取消后将在当前计费周期结束后失效，降级为免费版。已有的简历和数据不会丢失。",
  },
  {
    q: "年付比月付便宜多少？",
    a: "专业版年付 ¥249（相当于月均 ¥20.75，省 ¥99），旗舰版年付 ¥499（相当于月均 ¥41.58，省 ¥209）。",
  },
  {
    q: "支持哪些支付方式？",
    a: "支持微信支付、支付宝和信用卡。",
  },
  {
    q: "我的简历数据安全吗？",
    a: "是的，所有数据加密传输和存储，不会用于模型训练。你可以随时导出或删除所有数据。",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            简单透明的定价
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            免费开始，按需升级，随时取消
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center rounded-lg border p-1">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
            >
              月付
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
            >
              年付
              <Badge variant="secondary" className="ml-1 text-[10px]">
                省 30%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price =
              billingCycle === "monthly" ? plan.monthly : plan.yearly;
            const periodLabel = billingCycle === "monthly" ? "/月" : "/年";

            return (
              <Card
                key={plan.name}
                className={
                  plan.popular
                    ? "relative border-emerald-600 border-2 shadow-lg scale-105"
                    : ""
                }
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    最受欢迎
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">
                      ¥{price}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500">{periodLabel}</span>
                    )}
                  </div>
                  {billingCycle === "yearly" && plan.monthly > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      相当于 ¥{(plan.yearly / 12).toFixed(0)}/月
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            feature.included
                              ? "text-green-500"
                              : "text-gray-200"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            feature.included
                              ? "text-gray-700"
                              : "text-gray-300 line-through"
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({
                        variant: plan.popular ? "default" : "outline",
                      }),
                      "mt-8 w-full"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center">常见问题</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="flex items-center gap-2 font-semibold">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  {faq.q}
                </h3>
                <p className="mt-1 text-gray-600 pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
