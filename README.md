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


## 项目结构
```
pixel-artist/
├── public/                  # 静态资源目录
│   ├── logo.svg             # 应用图标
│   ├── logo-white.svg       # 白色版本应用图标
│   ├── favicon.ico          # 网站图标
│   ├── sitemap.xml          # 自动生成的站点地图（构建时生成）
│   └── robots.txt           # 自动生成的 robots 文件（构建时生成）
│
├── src/                     # 源代码目录
│   ├── assets/              # 项目资源文件
│   │   ├── logo.svg         # 应用图标
│   │   ├── logo.png         # 应用图标(PNG)
│   │   ├── logo-white.svg   # 白色版本应用图标
│   │   ├── logo-white.png   # 白色版本应用图标(PNG)
│   │   ├── logo-with-title.svg  # 带标题的应用图标
│   │   └── logo-with-title.png  # 带标题的应用图标(PNG)
│   │
│   ├── components/          # 公共组件
│   │   ├── Layout/          # 布局组件
│   │   │   ├── index.tsx    # 布局组件实现
│   │   │   └── index.module.less  # 布局组件样式
│   │   └── SEO/             # SEO 相关组件
│   │       └── index.tsx    # SEO 组件实现
│   │
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   │   ├── index.tsx    # 首页组件
│   │   │   └── index.module.less  # 首页样式
│   │   └── NotFound/        # 404 页面
│   │       ├── index.tsx    # 404 组件
│   │       └── index.module.less  # 404 样式
│   │
│   ├── routes/              # 路由配置
│   │   └── index.tsx        # 路由定义
│   │
│   ├── styles/              # 全局样式
│   │   ├── global.less      # 全局基础样式
│   │   ├── ant-design.less  # Ant Design 组件样式覆盖
│   │   └── index.less       # 样式入口文件
│   │
│   ├── utils/               # 工具函数
│   │   ├── colors.ts        # 颜色工具
│   │   ├── theme.ts         # 主题配置
│   │   └── seo.ts           # SEO 辅助函数
│   │
│   ├── main.tsx             # 应用入口
│   └── vite-env.d.ts        # Vite 类型声明
│
├── scripts/                 # 构建辅助脚本
│   └── generate-seo-files.js  # 生成 sitemap.xml 与 robots.txt
│
├── .env.example             # 环境变量示例
├── .gitignore               # Git 忽略文件
├── eslint.config.js         # ESLint 配置
├── index.html               # HTML 模板
├── package.json             # 项目依赖和脚本
├── tsconfig.json            # TypeScript 配置
├── tsconfig.app.json        # 应用 TypeScript 配置
├── tsconfig.node.json       # Node.js TypeScript 配置
└── vite.config.ts           # Vite 配置
```