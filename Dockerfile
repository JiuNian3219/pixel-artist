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

# 接收构建参数
ARG VITE_UMAMI_WEBSITE_ID
ARG VITE_UMAMI_SCRIPT_URL
ARG VITE_SITE_URL

# 设置为环境变量，供 build 过程使用
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_SCRIPT_URL=$VITE_UMAMI_SCRIPT_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# 复制源码并构建
COPY . .
RUN npm run build

# Stage 2: 运行静态服务（无 TLS，交由网关 Caddy 处理）
FROM caddy:2.8-alpine

# 项目内部 Caddyfile（提供 SPA 路由回退）
COPY Caddyfile /etc/caddy/Caddyfile

# 将编译后的静态产物复制到 Caddy 默认站点目录
COPY --from=builder /app/dist/client /usr/share/caddy

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]



