# Pixel Artist

一个使用 React、TypeScript 和 Vite 构建的像素艺术创作工具。

## 项目介绍

Pixel Artist 是一个简单易用的图片像素化工具，允许用户将普通图片转换为像素风格的艺术作品。

## 技术栈

- **前端框架**: React 19
- **开发语言**: TypeScript
- **构建工具**: Vite 7
- **UI 组件库**: Ant Design 5
- **路由管理**: Vike
- **预渲染/SSG**: Vike (原 vite-plugin-ssr)
- **样式处理**: Less

## 项目结构

```
pixel-artist/
├── public/                  # 静态资源（favicon, robots.txt, 字体等）
├── scripts/                 # 构建脚本（Sitemap, Bing验证等）
├── src/
│   ├── assets/              # 图片与图标资源
│   ├── components/          # 公共组件 (Layout, SEO, LanguageSwitcher 等)
│   ├── hooks/               # 自定义 Hooks
│   ├── locales/             # 国际化资源 (zh, en)
│   ├── pages/               # 页面文件 (Vike 路由结构)
│   │   ├── @locale/         # 动态路由参数
│   │   ├── Creator/         # 创作页
│   │   ├── Editor/          # 编辑器页
│   │   ├── Home/            # 首页
│   │   └── index/           # 根路由重定向
│   ├── renderer/            # Vike 渲染逻辑 (+onRenderHtml, +onRenderClient)
│   ├── stores/              # 全局状态管理 (Zustand)
│   ├── styles/              # 全局样式与 AntD 主题
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数与算法
│   ├── workers/             # Web Workers (图像处理)
│   └── vite-env.d.ts        # Vite 环境变量定义
├── .env                     # 环境变量
├── .github/workflows/       # GitHub Actions 工作流
├── Dockerfile               # Docker 构建配置
├── package.json             # 依赖与脚本
└── vite.config.ts           # Vite 配置
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## CI/CD 工作流

本项目使用 GitHub Actions 实现自动化构建与部署，采用 **Main/Preview 双分支策略**，实现生产环境与预览环境的完全隔离。工作流文件位于 `.github/workflows/deploy.yml`。

### 1. 预览环境 (Preview)
- **触发条件**: Push to `preview` branch
- **构建行为**:
  - Docker Tag: `:preview`
- **部署行为**:
  - 容器名: `pixel-artist-preview`
  - 网络: 加入 `caddy_net`，不映射宿主机端口
  - 访问: 通过宿主机 Caddy 网关转发 (内部端口 -> `/pixel-artist/`)

### 2. 生产环境 (Production)
- **触发条件**: Push to `main` branch
- **构建行为**:
  - Docker Tag: `:latest`
- **部署行为**:
  - 容器名: `pixel-artist`
  - 网络: 加入 `caddy_net`
  - 访问: 通过宿主机 Caddy 网关转发 (Port 80/443 -> `/`)

### 3. Pull Request
- **触发条件**: PR to `main` or `preview`
- **行为**:
  - 执行 `Build Image` 验证构建是否成功
  - 生成 Docker Tag: `:pr-<number>`
  - **不进行推送和部署**，仅作为代码质量检查

### 环境与 Secrets
若要 fork 本项目或自行部署，需在 GitHub 仓库设置中配置以下 Secrets：

| Secret 名称 | 必须 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `DEPLOY_HOST` | ✅ | 部署服务器 IP 或域名 | `1.2.3.4` |
| `DEPLOY_USER` | ✅ | SSH 登录用户名（需有 Docker 权限） | `root` |
| `DEPLOY_SSH_KEY` | ✅ | SSH 私钥（对应公钥需配置在服务器） | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `VITE_SITE_URL` | - | 生产环境站点完整 URL (缺省为 `https://example.com`) | `https://pixel.example.com` |
| `VITE_UMAMI_WEBSITE_ID` | - | Umami 统计 Website ID (不填则不启用统计) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_UMAMI_SCRIPT_URL` | - | Umami 统计脚本地址 (不填则不启用统计) | `https://analytics.example.com/script.js` |
| `BING_SITE_AUTH_USER` | - | Bing Webmaster 验证用户代码 (不填则不生成验证文件) | `D6534387994FC508...` |

> **提示**: 可在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加上述 Secrets。
> 
> 此外，如果你需要自定义 `robots.txt` 允许的爬取路径，可以在 **Variables** 中添加 `VITE_ROBOTS_ALLOW`（默认为 `/`）。

## 服务器配置 (Caddy)

为了支持预览环境访问，需要在服务器的主 Caddyfile 中配置反向代理规则（通常使用独立端口或子域名）。
**注意**：预览环境使用内部端口（下文以 `:PREVIEW_PORT` 代替，请根据实际情况配置），不对外直接暴露。

```caddy
# 生产环境 (Port 80/443)
your-domain.com {
    reverse_proxy pixel-artist:80
}

# 预览环境网关 (自定义端口)
:PREVIEW_PORT {
    encode gzip
    
    # Pixel Artist 预览版转发
    reverse_proxy pixel-artist-preview:80
}
```

## 代码规范与提交
本项目配置了 Husky + Commitlint + Lint-staged 以确保代码与提交质量。

### 提交规范 (Conventional Commits)
提交信息必须遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
```bash
<type>(<scope>): <subject>
```
常用 type：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `chore`: 构建过程或辅助工具变动
- `ci`: CI 配置文件变动

示例：
```bash
git commit -m "feat(editor): add color picker component"
git commit -m "ci(workflow): split build job for PR and push"
```

### Git Hooks
- **pre-commit**: 提交前自动运行 `lint-staged`，对暂存区文件执行 ESLint 与 Prettier 修复。
- **commit-msg**: 提交时检查 commit message 格式，不符合规范将拒绝提交。

## 分析配置

本项目使用 Umami 进行网站访问分析。要启用分析功能，请创建一个 `.env` 文件（或在 CI/CD Secrets 中配置）：

```env
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://your-umami-domain.com/script.js
```

请将 `your-website-id` 替换为您的 Umami 网站 ID，将 `https://your-umami-domain.com/script.js` 替换为您的 Umami 脚本 URL。

## SEO 配置
本项目进行了SEO优化，若需要使用，请配置SEO相关环境变量：

```env
// 站点基础 URL，用于生成 canonical、og:image 等
VITE_SITE_URL=https://your-domain.com
// 允许索引的路径，多个路径用逗号分隔
VITE_ROBOTS_ALLOW=/
```

注意事项：
- 构建前会自动生成 `public/sitemap.xml` 与 `public/robots.txt`（参见构建脚本）；确保 `VITE_SITE_URL` 已正确设置。
- 页面内 `SEO` 组件会使用 `VITE_SITE_URL` 来拼接 `canonical`、`og:image` 与 JSON-LD 中的 `url`。
- 404 页已通过 `robots="noindex,nofollow"` 防止被索引。

## 站长工具验证
若需要自动生成 `BingSiteAuth.xml` 验证文件，请在 `.env` 中配置：

```env
BING_SITE_AUTH_USER=**************************
```
构建时会自动读取该变量并在 `public/` 目录下生成 `BingSiteAuth.xml`。

## 多语言：如何添加新语言
本项目已内置中文（`zh`）与英文（`en`）。若要新增语言（例如法语 `fr`），请按照以下步骤修改相应文件：

1) **类型与语言常量**
- 修改 `src/types/locale.ts`：将新语言加入 `Locale` 与（如需）`OgLocale` 联合类型。
  - 例如：加入 `"fr"` 到 `Locale`，并在需要时加入 `"fr_FR"` 到 `OgLocale`。
- 修改 `src/utils/locale.ts`：
  - 将新语言加入 `LOCALES` 常量数组。
  - 为 `OG_LOCALE_MAP` 添加映射。
  - 更新 `normalizeLocale` 逻辑。

2) **i18n 资源**
- 在 `src/locales/<lang>/` 目录创建翻译文件（`common.json`, `home.json` 等）。
- 修改 `src/locales/index.ts` 注册新语言。

3) **Ant Design 语言包**
- 修改 `src/renderer/PageShell.tsx` 或相关入口文件，引入并配置 AntD 的 locale。

4) **路由与预渲染**
- 路由由 Vike 基于文件系统自动处理（`src/pages/@locale`），通常无需手动修改路由配置。
- 确保 `src/utils/seo.ts` 中包含新语言的 SEO 元数据。
- 修改 `scripts/generate-sitemap.mjs` 将新语言加入 `locales` 数组以生成正确的 Sitemap。

5) **验证**
- 运行 `npm run dev` 访问 `/<lang>/` 检查页面。
- 运行 `npm run build` 检查构建产物（如 sitemap）。


