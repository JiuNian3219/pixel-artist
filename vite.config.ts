import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
