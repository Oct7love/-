#!/bin/bash
# ResumeBoost 一键部署脚本
# 使用方法：在服务器上运行 bash deploy.sh

set -e

echo "========================================="
echo "  ResumeBoost 部署脚本"
echo "========================================="

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "正在安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# 检查 docker-compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "正在安装 Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# 创建 .env.local（如果不存在）
if [ ! -f .env.local ]; then
    echo "请先创建 .env.local 文件！"
    echo ""
    echo "运行以下命令："
    echo "  cp .env.example .env.local"
    echo "  nano .env.local"
    echo ""
    echo "需要填写的关键变量："
    echo "  DATABASE_URL=postgresql://resumeboost:resumeboost_password_change_me@db:5432/resumeboost"
    echo "  OPENAI_API_KEY=你的DeepSeek API Key"
    echo "  OPENAI_API_BASE=https://api.deepseek.com"
    echo "  NEXTAUTH_SECRET=随机密钥（可用 openssl rand -base64 32 生成）"
    echo "  NEXTAUTH_URL=http://你的服务器IP:3000"
    exit 1
fi

echo "正在构建和启动服务..."
docker compose up -d --build

echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "常用命令："
echo "  查看日志: docker compose logs -f app"
echo "  重启服务: docker compose restart"
echo "  停止服务: docker compose down"
echo ""
