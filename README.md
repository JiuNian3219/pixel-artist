# Pixel Artist

一个使用 React、TypeScript 和 Vite 构建的像素艺术创作工具。

## 项目介绍

Pixel Artist 是一个简单易用的图片像素化工具，允许用户将普通图片转换为像素风格的艺术作品。

## 技术栈

- **前端框架**: React 19
- **开发语言**: TypeScript
- **构建工具**: Vite 7
- **UI 组件库**: Ant Design 5
- **路由管理**: React Router 7
- **样式处理**: Less

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
本项目使用 GitHub Actions 实现自动化构建与部署。工作流文件位于 `.github/workflows/deploy.yml`。

### 触发机制与流程
- **Push to main**：
  - 执行 `build-and-push`：构建 Docker 镜像并推送至 GHCR（标签 `:latest`）。
  - 执行 `deploy`：通过 SSH 连接服务器，拉取最新镜像并重启 `pixel-artist` 容器（部署到 Development 环境）。
- **Pull Request to main**：
  - 执行 `Build Image (PR)`：仅验证 Docker 镜像构建是否成功（标签 `:pr-<number>`，不推送、不部署），确保 PR 代码质量。

### 环境与 Secrets
若要 fork 本项目或自行部署，需在 GitHub 仓库设置中配置以下 Secrets（支持 Environments）：
- `DEPLOY_HOST`: 服务器 IP 或域名
- `DEPLOY_USER`: SSH 登录用户名（需加入 docker 用户组）
- `DEPLOY_SSH_KEY`: SSH 私钥（对应公钥需在服务器 `authorized_keys` 中）

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

本项目使用 Umami 进行网站访问分析（暂时只包含访问分析）。要启用分析功能，请创建一个 `.env` 文件并设置以下变量：

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

1) 类型与语言常量
- 修改 `src/types/locale.ts`：将新语言加入 `Locale` 与（如需）`OgLocale` 联合类型。
  - 例如：加入 `"fr"` 到 `Locale`，并在需要时加入 `"fr_FR"` 到 `OgLocale`。
- 修改 `src/utils/locale.ts`：
  - 将新语言加入 `LOCALES` 常量数组。
  - 为 `OG_LOCALE_MAP` 添加映射（如 `fr: "fr_FR"`）。
  - 更新 `normalizeLocale(input)` 使其识别新语言（按前缀或直接匹配）。

2) i18n 资源与支持列表
- 在 `src/locales/<lang>/` 目录创建翻译文件，至少包含：
  - `common.json`：需包含 `language.switch` 与 `language.names.<lang>`（用于语言切换器显示），以及通用文案。
  - `home.json`、`creator.json`、`404.json`：对应各页面的文案。
- 修改 `src/locales/index.ts`：
  - 在 `resources` 中注册新语言的各命名空间。
  - 将新语言加入 `supportedLngs` 列表。

3) Ant Design 语言包
- 修改 `src/components/App/index.tsx`：
  - 引入 AntD 对应语言包（如 `import frFR from "antd/locale/fr_FR"`）。
  - 将 `antdLocaleMap` 扩展为 `{ zh: zhCN, en: enUS, fr: frFR }`。
  - 若 AntD 暂无该语言包，可先回退到最接近的语言，确保不报错。

4) 路由与重定向（通常无需改动）
- 路由由 `src/routes/index.tsx` 基于 `LOCALES` 自动生成：会产生 `/<lang>/` 与 `/<lang>/creator` 等路径。
- 根路径重定向使用 `src/routes/RootRedirect.tsx`：会根据浏览器语言跳转到对应 `/<lang>/`。

5) SEO 与预渲染
- 修改 `src/utils/seo.ts`：
  - 在 `localizedSEO` 中为各基础路径（`"/"`、`"/creator"`、`"/404"`）补充新语言的 `title/description/keywords` 等。
  - 更新 `getAlternateLinks(siteUrl, basePath)` 以包含新语言的 `hreflang`。
- 修改站点地图生成脚本 `scripts/generate-sitemap.mjs`：
  - 将新语言加入 `locales` 数组（如 `const locales = ["zh", "en", "fr"];`）。
- 修改 `package.json` 的 `reactSnap.include`：
  - 添加新语言需要快照的路由，如 `"/<lang>/"`、`"/<lang>/creator"`。

6) 验证
- 运行开发服务器并检查新语言页面：
  - `npm run dev`
  - 打开 `http://localhost:5173/<lang>/`，检查页面文案与 AntD 组件文案是否为新语言。
- 构建并预览：
  - `npm run build`
  - `npm run preview`
  - 验证 `public/sitemap.xml` 是否包含新语言路径；预览页面源代码，确认 `og:locale` 与 `link[rel="alternate"]` 已包含新语言。

提示：新增语言时，优先复用现有工具与结构（`LOCALES`、`normalizeLocale`、`antdLocaleMap`、i18n `supportedLngs`、`reactSnap.include` 与 `sitemap locales`）。保持命名、风格与当前项目一致，避免引入额外依赖。


## 项目结构
```
pixel-artist/
├── public/                  # 静态资源（favicon, robots.txt 等）
├── scripts/                 # 构建脚本（Sitemap, Bing验证等）
├── src/
│   ├── assets/              # 图片与图标资源
│   ├── components/          # 公共组件 (Layout, SEO 等)
│   ├── hooks/               # 自定义 Hooks
│   ├── locales/             # 国际化资源 (zh, en)
│   ├── pages/               # 路由页面 (Home, Editor, Creator)
│   ├── routes/              # 路由配置
│   ├── stores/              # 全局状态管理 (Zustand)
│   ├── styles/              # 全局样式与 AntD 主题
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数与算法
│   ├── workers/             # Web Workers (图像处理)
│   └── main.tsx             # 应用入口
├── .env                     # 环境变量
├── package.json             # 依赖与脚本
└── vite.config.ts           # Vite 配置
```