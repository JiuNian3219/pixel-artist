# 生产镜像：多阶段构建，最终使用 Caddy 静态服务
# Stage 1: 构建前端产物（使用 Debian 基础镜像，兼容 react-snap/puppeteer）
FROM node:20-bullseye AS builder
WORKDIR /app

# 为 Puppeteer/Chromium 安装必要系统依赖，以支持 react-snap
RUN apt-get update && apt-get install -y \
  libx11-xcb1 \
  libx11-6 \
  libxcomposite1 \
  libxrandr2 \
  libxi6 \
  libxrender1 \
  libxss1 \
  libxext6 \
  libxfixes3 \
  libnss3 \
  libnspr4 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libasound2 \
  libxdamage1 \
  libxshmfence1 \
  fonts-liberation \
  ca-certificates && rm -rf /var/lib/apt/lists/*

# 仅在包文件变更时重装依赖
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# 复制源码并构建
COPY . .

# 使用 Secret Mount 挂载敏感变量并执行构建
# 注意：Secret 仅在当前 RUN 指令执行期间可用，不会持久化到镜像中
RUN --mount=type=secret,id=VITE_UMAMI_WEBSITE_ID,required=false \
    --mount=type=secret,id=VITE_UMAMI_SCRIPT_URL,required=false \
    --mount=type=secret,id=VITE_SITE_URL,required=false \
    --mount=type=secret,id=BING_SITE_AUTH_USER,required=false \
    --mount=type=secret,id=VITE_ROBOTS_ALLOW,required=false \
    # 将 Secret 读取为环境变量
    export VITE_UMAMI_WEBSITE_ID=$(cat /run/secrets/VITE_UMAMI_WEBSITE_ID 2>/dev/null || echo "") && \
    export VITE_UMAMI_SCRIPT_URL=$(cat /run/secrets/VITE_UMAMI_SCRIPT_URL 2>/dev/null || echo "") && \
    export VITE_SITE_URL=$(cat /run/secrets/VITE_SITE_URL 2>/dev/null || echo "") && \
    export BING_SITE_AUTH_USER=$(cat /run/secrets/BING_SITE_AUTH_USER 2>/dev/null || echo "") && \
    export VITE_ROBOTS_ALLOW=$(cat /run/secrets/VITE_ROBOTS_ALLOW 2>/dev/null || echo "") && \
    # 执行构建
    npm run build

# Stage 2: 运行静态服务（无 TLS，交由网关 Caddy 处理）
FROM caddy:2.8-alpine

# 项目内部 Caddyfile（提供 SPA 路由回退）
COPY Caddyfile /etc/caddy/Caddyfile

# 将编译后的静态产物复制到 Caddy 默认站点目录
COPY --from=builder /app/dist/client /usr/share/caddy

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]





