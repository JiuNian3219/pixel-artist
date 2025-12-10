import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve(__dirname, '../dist');

// --- 新增：简单的 .env 加载器（用于本地开发） ---
// 在 CI/Docker 环境中，环境变量通常已经存在于 process.env 中
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // 去除引号
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log('Loaded local .env file');
  }
} catch (e) {
  console.warn('Failed to load .env file:', e.message);
}

const ROUTES = [
  '/',
  '/zh',
  '/en',
  '/zh/creator',
  '/en/creator',
  '/zh/editor',
  '/en/editor'
];

async function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  console.log('🚀 Starting Custom Prerender...');

  // 1. 启动 Vite Preview 服务
  // 使用 shell: true 来解决 Windows 下的 spawn 问题
  const serverProcess = spawn('npm', ['run', 'preview', '--', '--port', `${PORT}`, '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    detached: false,
    shell: true, // 关键修复：启用 shell 模式
  });

  try {
    console.log(`Waiting for server at ${BASE_URL}...`);
    const serverReady = await waitForServer(BASE_URL);
    if (!serverReady) {
      throw new Error('Server failed to start');
    }

    // 2. 启动浏览器
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 模拟 ReactSnap UA，保持兼容性（有些逻辑可能会检查 UA）
    await page.setUserAgent('ReactSnap');

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      console.log(`Crawling: ${route}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        // 简单等待 hydration 完成 (确保 root 挂载)
        await page.waitForSelector('#root', { timeout: 10000 });

        // 额外等待一小会儿确保 JS 执行完毕
        await new Promise(r => setTimeout(r, 500));

        // --- 新增：清理重复的 SEO 标签 ---
        await page.evaluate(() => {
          // 1. 识别 Helmet 管理的标签
          const helmetNodes = document.querySelectorAll('[data-react-helmet]');
          const helmetKeys = new Set();

          helmetNodes.forEach(node => {
            if (node.tagName === 'TITLE') {
              helmetKeys.add('title');
            } else if (node.tagName === 'META') {
              const name = node.getAttribute('name');
              const property = node.getAttribute('property');
              if (name) helmetKeys.add(`meta:name:${name}`);
              if (property) helmetKeys.add(`meta:property:${property}`);
            }
          });

          // 2. 移除冲突的原始标签 (非 Helmet 生成的)
          if (helmetKeys.has('title')) {
            document.querySelectorAll('title').forEach(t => {
              if (!t.hasAttribute('data-react-helmet')) t.remove();
            });
          }

          document.querySelectorAll('meta').forEach(meta => {
            if (meta.hasAttribute('data-react-helmet')) return;
            // 保留 viewport, charset 等关键标签
            if (meta.getAttribute('name') === 'viewport' || meta.getAttribute('charset')) return;

            const name = meta.getAttribute('name');
            const property = meta.getAttribute('property');

            if (name && helmetKeys.has(`meta:name:${name}`)) {
              meta.remove();
            }
            if (property && helmetKeys.has(`meta:property:${property}`)) {
              meta.remove();
            }
          });
        });
        // --- 清理结束 ---

        let content = await page.content();

        // --- 新增：强制注入 Umami 脚本 (兜底策略) ---
        // 防止 React Hydration 或 Puppeteer 序列化导致脚本丢失
        const umamiId = process.env.VITE_UMAMI_WEBSITE_ID;
        const umamiUrl = process.env.VITE_UMAMI_SCRIPT_URL;

        if (umamiId && umamiUrl) {
          // 检查是否已存在（避免重复注入）
          if (!content.includes(umamiId)) {
            console.log(`Injecting Umami script for ${route}...`);
            const scriptTag = `<script defer src="${umamiUrl}" data-website-id="${umamiId}"></script>`;
            content = content.replace('</head>', `${scriptTag}\n</head>`);
          }
        }
        // --- 注入结束 ---

        // 计算文件保存路径
        // / -> dist/index.html
        // /zh -> dist/zh/index.html
        let filePath;
        if (route === '/') {
          filePath = path.join(DIST_DIR, 'index.html');
        } else {
          const relative = route.startsWith('/') ? route.substring(1) : route;
          filePath = path.join(DIST_DIR, relative, 'index.html');
        }

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
        console.log(`✅ Saved: ${filePath}`);

      } catch (e) {
        console.error(`❌ Failed to render ${route}:`, e);
        // 不中断整个流程，继续下一个
      }
    }

    await browser.close();

  } catch (error) {
    console.error('Prerender error:', error);
    process.exit(1);
  } finally {
    // 杀死服务
    if (serverProcess) {
      if (process.platform === 'win32') {
        try {
          spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
        } catch (e) {
          serverProcess.kill();
        }
      } else {
        serverProcess.kill();
      }
    }
    console.log('✨ Prerender complete.');
    process.exit(0);
  }
}

main();





