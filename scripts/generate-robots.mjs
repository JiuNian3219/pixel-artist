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
  return `# As a condition of accessing this website, you agree to abide by the 
# following content-signals: 
# 
# (a)  If a content-signal = yes, you may collect content for the 
#      corresponding use. 
# (b)  If a content-signal = no, you may not collect content for the 
#      corresponding use. 
# (c)  If the website operator does not include a content signal for a 
#      corresponding use, the website operator neither grants nor restricts 
#      permission via content signal with respect to the corresponding use. 
# 
# The content signals and their meanings are: 
# 
# search: building a search index and providing search results (e.g., returning 
#         hyperlinks and short excerpts from your website's contents). Search 
#         does not include providing AI-generated search summaries. 
# ai-input: inputting content into one or more AI models (e.g., retrieval 
#           augmented generation, grounding, or other real-time taking of 
#           content for generative AI search answers). 
# ai-train: training or fine-tuning AI models. 
# 
# ANY RESTRICTIONS EXPRESSED VIA CONTENT-SIGNALS ARE EXPRESS RESERVATIONS OF 
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT 
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET. 

# BEGIN Cloudflare Managed content 

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