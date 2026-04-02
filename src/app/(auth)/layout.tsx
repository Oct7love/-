import { SessionProvider } from "@/components/shared/session-provider";
import { Sparkles, Zap, Shield, BarChart3 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex">
        {/* Left brand panel */}
        <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-xl font-semibold">Oct7</span>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-[36px] leading-[1.15] font-semibold text-white tracking-tight">
              让简历
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                精准传达
              </span>
              <br />
              你的价值
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-sm">
              AI 驱动的简历优化平台。智能诊断、一键改写、岗位匹配，让每一份简历都能脱颖而出。
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "30 秒出结果" },
                { icon: Shield, label: "数据加密" },
                { icon: BarChart3, label: "ATS 友好" },
                { icon: Sparkles, label: "AI 驱动" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-gray-400 text-[13px]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-gray-500 text-[12px]">
              &copy; {new Date().getFullYear()} Oct7. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
