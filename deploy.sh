#!/bin/bash
# ResumeBoost 一键部署脚本（2G 小服务器专用）
# 数据库使用 Neon 云托管，服务器只跑 Next.js 应用
# 使用方法：bash deploy.sh

set -e

echo "========================================="
echo "  ResumeBoost 部署脚本"
echo "========================================="
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "[1/4] 正在安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo "  Docker 安装完成"
else
    echo "[1/4] Docker 已安装"
fi

# 检查 docker compose
if ! docker compose version &> /dev/null 2>&1; then
    echo "[2/4] 正在安装 Docker Compose 插件..."
    apt-get update -qq && apt-get install -y -qq docker-compose-plugin > /dev/null
    echo "  Docker Compose 安装完成"
else
    echo "[2/4] Docker Compose 已安装"
fi

# 检查 .env.local
if [ ! -f .env.local ]; then
    echo ""
    echo "[3/4] 请先创建 .env.local 文件！"
    echo ""
    echo "步骤："
    echo "  1. cp .env.example .env.local"
    echo "  2. nano .env.local"
    echo ""
    echo "必须填写的变量："
    echo "  DATABASE_URL       → 去 https://neon.tech 注册免费数据库，复制连接字符串"
    echo "  OPENAI_API_KEY     → 你的 DeepSeek API Key"
    echo "  NEXTAUTH_SECRET    → 运行 openssl rand -base64 32 生成"
    echo "  NEXTAUTH_URL       → http://你的域名或IP:3000"
    echo ""
    echo "示例："
    echo '  DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require'
    echo '  OPENAI_API_KEY=sk-xxx'
    echo '  NEXTAUTH_SECRET=$(openssl rand -base64 32)'
    echo '  NEXTAUTH_URL=http://example.com:3000'
    echo ""
    exit 1
else
    echo "[3/4] .env.local 已存在"
fi

# 构建和启动
echo "[4/4] 正在构建和启动应用..."
echo ""

# 清理旧镜像释放空间（小服务器磁盘有限）
docker system prune -f > /dev/null 2>&1 || true

docker compose up -d --build

echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""

SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "your-server-ip")
echo "访问地址: http://${SERVER_IP}:3000"
echo ""
echo "首次启动后，运行数据库迁移："
echo "  docker compose exec app node -e \"require('./node_modules/drizzle-kit/bin.cjs')\" push"
echo "  或在本地运行: npm run db:push"
echo ""
echo "常用命令："
echo "  查看日志:   docker compose logs -f app"
echo "  重启服务:   docker compose restart"
echo "  停止服务:   docker compose down"
echo "  查看状态:   docker compose ps"
echo "  查看资源:   docker stats"
echo ""
