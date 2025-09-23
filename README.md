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

## 项目结构
```
pixel-artist/ 
├── public/                  # 静态资源目录
│   ├── logo.svg             # 应用图标
│   └── logo-white.svg       # 白色版本应用图标
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
│   │   └── Layout/          # 布局组件
│   │       ├── index.tsx    # 布局组件实现
│   │       └── index.module.less  # 布局组件样式
│   │
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   └── NotFound/        # 404页面
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
│   │   └── theme.ts         # 主题配置
│   │
│   ├── main.tsx             # 应用入口
│   └── vite-env.d.ts        # Vite 类型声明
│
├── .gitignore               # Git 忽略文件
├── eslint.config.js         # ESLint 配置
├── index.html               # HTML 模板
├── package.json             # 项目依赖和脚本
├── tsconfig.json            # TypeScript 配置
├── tsconfig.app.json        # 应用 TypeScript 配置
├── tsconfig.node.json       # Node.js TypeScript 配置
└── vite.config.ts           # Vite 配置
```