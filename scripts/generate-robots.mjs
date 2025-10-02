import fs from "fs";
import path from "path";
import { loadEnv } from "vite";

const cwd = process.cwd();

function getModeArg() {
  const arg = process.argv.find((a) => a.startsWith("--mode="));
  return arg ? arg.split("=")[1] : undefined;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function buildRobotsTxt({ siteUrl, allowPath = "/" }) {
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  // 此处robots内容用的是cloudflare自动生成的robots.txt，同时底部添加sitemap，请根据需要修改
  return `
User-Agent: * 
Content-signal: search=yes,ai-input=no,ai-train=no
Allow: ${allowPath}

User-agent: Amazonbot 
Disallow: / 

User-agent: Applebot-Extended 
Disallow: / 

User-agent: Bytespider 
Disallow: / 

User-agent: CCBot 
Disallow: / 

User-agent: ClaudeBot 
Disallow: / 

User-agent: Google-Extended 
Disallow: / 

User-agent: GPTBot 
Disallow: / 

User-agent: meta-externalagent 
Disallow: / 

Sitemap: ${sitemapUrl}

# END Cloudflare Managed Content
`;
}

(async () => {
  try {
    const mode = getModeArg() || process.env.NODE_ENV || "production";
    const env = loadEnv(mode, cwd);
    const rawUrl = env.VITE_SITE_URL || "https://example.com";
    const siteUrl = rawUrl.replace(/\/+$/, "");
    const allowPath = env.VITE_ROBOTS_ALLOW || "/";

    const publicDir = path.join(cwd, "public");
    ensureDir(publicDir);

    const robotsTxt = buildRobotsTxt({ siteUrl, allowPath });
    const robotsPath = path.join(publicDir, "robots.txt");
    fs.writeFileSync(robotsPath, robotsTxt, "utf-8");

    console.log(`[robots] generated: ${robotsPath}`);
  } catch (err) {
    console.error("[robots] generation failed:", err);
    process.exit(1);
  }
})();