# ResumeBoost — AI 简历优化平台

基于 AI 的在线简历优化平台，帮助求职者快速诊断、改写和美化简历，提升面试邀约率。

## 功能特性

- **AI 智能诊断** — 从 5 个维度为简历打分，精准定位薄弱环节
- **一键改写** — AI 自动改写经历描述，支持 3 种风格（专业/简洁/创意）
- **JD 匹配分析** — 分析简历与目标岗位的匹配度，给出调整建议
- **简历上传解析** — 上传 PDF/Word 简历，AI 自动提取结构化内容
- **模板系统** — 多套专业简历模板，支持自定义颜色和排版
- **PDF 导出** — 导出 ATS 友好的专业 PDF 简历

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| UI | TailwindCSS 4 + Shadcn/UI |
| 状态管理 | Zustand |
| ORM | Drizzle ORM |
| 数据库 | PostgreSQL (Neon) |
| AI | Vercel AI SDK + OpenAI |
| 认证 | NextAuth.js v5 |
| 部署 | Vercel |

## 快速开始

### 环境要求

- Node.js 20+
- PostgreSQL 16+

### 安装

```bash
git clone https://github.com/your-org/resumeboost.git
cd resumeboost
npm install
```

### 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 填入你的 API Keys
```

必须配置的环境变量：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `NEXTAUTH_SECRET` | NextAuth 密钥 |
| `OPENAI_API_KEY` | OpenAI API Key |

### 数据库迁移

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # 营销页面（隐私、条款）
│   ├── (auth)/             # 认证页面（登录、注册）
│   ├── (dashboard)/        # 仪表盘（需登录）
│   │   ├── dashboard/      # 简历列表
│   │   ├── editor/[id]/    # 简历编辑器
│   │   ├── templates/      # 模板中心
│   │   └── settings/       # 账户设置
│   └── api/                # API Routes
│       ├── auth/           # 认证 API
│       ├── resumes/        # 简历 CRUD + 上传 + 导出
│       └── ai/             # AI 诊断/改写/匹配
├── components/
│   ├── ui/                 # Shadcn/UI 基础组件
│   ├── editor/             # 编辑器专属组件
│   ├── templates/          # 简历模板组件
│   └── shared/             # 通用组件
├── lib/
│   ├── db/                 # Drizzle Schema + 数据库连接
│   ├── ai/prompts/         # AI Prompt 模板
│   └── auth/               # NextAuth 配置
├── stores/                 # Zustand 状态管理
└── types/                  # TypeScript 类型定义
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth 认证 |
| GET/POST | `/api/resumes` | 简历列表/创建 |
| GET/PATCH/DELETE | `/api/resumes/[id]` | 简历 CRUD |
| POST | `/api/resumes/upload` | 上传简历并解析 |
| POST | `/api/resumes/[id]/export` | 导出简历 |
| POST | `/api/ai/diagnose` | AI 诊断评分 |
| POST | `/api/ai/rewrite` | AI 改写（流式） |
| POST | `/api/ai/jd-match` | JD 匹配分析 |

## 文档

项目文档位于 `docs/` 目录：

- `01-PRD-产品需求文档.md` — 产品需求
- `02-技术架构文档.md` — 系统架构
- `03-数据库设计文档.md` — 数据库设计
- `04-API接口设计文档.md` — API 规范
- `05-UI-UX设计规范.md` — 设计系统
- `06-用户手册.md` — 使用指南
- `07-项目开发计划.md` — 开发排期

## License

MIT
