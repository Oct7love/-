export const metadata = {
  title: "隐私政策 — ResumeBoost",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">隐私政策</h1>
      <p className="mt-2 text-gray-500">最后更新：2026 年 3 月 29 日</p>

      <div className="mt-8 prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. 信息收集</h2>
          <p className="text-gray-600 mt-2">
            我们收集你在注册和使用服务过程中主动提供的信息，包括：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>账户信息：邮箱地址、用户名、密码（加密存储）</li>
            <li>简历内容：你上传或在线编辑的简历信息</li>
            <li>使用数据：功能使用频率、页面浏览记录</li>
            <li>设备信息：浏览器类型、操作系统、IP 地址</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. 信息使用</h2>
          <p className="text-gray-600 mt-2">我们使用收集的信息用于：</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>提供、维护和改进我们的服务</li>
            <li>AI 简历诊断和改写（仅在你请求时处理）</li>
            <li>发送服务通知和产品更新</li>
            <li>防止欺诈和滥用</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. 数据安全</h2>
          <p className="text-gray-600 mt-2">
            我们采取业界标准的安全措施保护你的数据：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>全站 HTTPS 加密传输</li>
            <li>密码使用 bcrypt 算法加密存储</li>
            <li>简历文件加密存储</li>
            <li>定期安全审计</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. AI 数据处理</h2>
          <p className="text-gray-600 mt-2">
            当你使用 AI 诊断或改写功能时，你的简历内容会被发送到 AI 服务进行处理。我们承诺：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>不会将你的简历数据用于模型训练</li>
            <li>AI 处理完成后不保留处理缓存</li>
            <li>仅在你主动发起请求时才会处理数据</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. 数据删除</h2>
          <p className="text-gray-600 mt-2">
            你可以随时在设置页面删除你的账户和所有数据。删除后，我们将在 30 天内永久清除所有关联数据。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Cookie 使用</h2>
          <p className="text-gray-600 mt-2">
            我们使用必要的 Cookie 来维持登录状态和提供基本功能。我们不使用第三方追踪 Cookie。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. 联系我们</h2>
          <p className="text-gray-600 mt-2">
            如果你对隐私政策有任何疑问，请联系 support@resumeboost.com。
          </p>
        </section>
      </div>
    </div>
  );
}
