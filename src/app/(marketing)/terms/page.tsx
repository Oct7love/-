export const metadata = {
  title: "使用条款 — ResumeBoost",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">使用条款</h1>
      <p className="mt-2 text-gray-500">最后更新：2026 年 3 月 29 日</p>

      <div className="mt-8 prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. 服务概述</h2>
          <p className="text-gray-600 mt-2">
            ResumeBoost 是一个基于 AI 的在线简历优化平台。使用本服务即表示你同意遵守这些条款。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. 账户责任</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>你需要提供真实、准确的注册信息</li>
            <li>你有责任保管好自己的账户密码</li>
            <li>你对账户下的所有活动负责</li>
            <li>发现未经授权使用时应立即通知我们</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. 内容所有权</h2>
          <p className="text-gray-600 mt-2">
            你上传或创建的简历内容归你所有。我们不会未经你同意使用、分享或出售你的个人简历内容。
            AI 生成的改写建议供你参考和使用，采纳后成为你的内容。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. AI 服务免责</h2>
          <p className="text-gray-600 mt-2">
            AI 诊断和改写功能提供参考建议。我们不保证：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>AI 建议的完全准确性</li>
            <li>使用后一定能获得面试机会</li>
            <li>改写内容完全适合所有场景</li>
          </ul>
          <p className="text-gray-600 mt-2">
            建议你在采纳 AI 改写前仔细检查内容的准确性。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. 使用限制</h2>
          <p className="text-gray-600 mt-2">你不得：</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>使用自动化工具大规模调用 AI 服务</li>
            <li>将本服务用于生成虚假简历或欺诈行为</li>
            <li>逆向工程、破解或干扰服务正常运行</li>
            <li>转售或二次分发服务功能</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. 订阅与付款</h2>
          <p className="text-gray-600 mt-2">
            付费订阅按选择的计费周期自动续费。你可以随时取消，取消后将在当前周期结束后失效。
            已支付的费用不予退还。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. 服务变更</h2>
          <p className="text-gray-600 mt-2">
            我们保留随时修改、暂停或终止服务的权利。重大变更将提前通知用户。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. 联系方式</h2>
          <p className="text-gray-600 mt-2">
            对使用条款有疑问请联系 support@resumeboost.com。
          </p>
        </section>
      </div>
    </div>
  );
}
