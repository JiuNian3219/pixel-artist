import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'inject-umami',
        transformIndexHtml(html) {
          if (env.VITE_UMAMI_WEBSITE_ID && env.VITE_UMAMI_SCRIPT_URL) {
            return html.replace(
              '</head>',
              `<script defer src="${env.VITE_UMAMI_SCRIPT_URL}" data-website-id="${env.VITE_UMAMI_WEBSITE_ID}"></script>\n  </head>`
            );
          }
          return html;
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      // 让构建产物兼容老版 Chromium，避免 ?. / ?? 等现代语法
      target: ['es2019', 'chrome79'],
    },
    esbuild: {
      // 开发与依赖转译目标也统一降级，进一步规避现代语法
      target: 'es2019',
    },
  };
});
