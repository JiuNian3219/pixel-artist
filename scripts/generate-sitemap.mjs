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

function buildSitemapXml(siteUrl, routes) {
  const urls = routes
    .map((r) => {
      const loc = `${siteUrl}${r.path}`;
      const priority = r.priority || "0.8";
      const changefreq = r.changefreq || "weekly";
      return `
  <url>
    <loc>${loc}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

(async () => {
  try {
    const mode = getModeArg() || process.env.NODE_ENV || "production";
    const env = loadEnv(mode, cwd);
    const rawUrl = env.VITE_SITE_URL || "https://example.com";
    // 去除结尾横杠
    const siteUrl = rawUrl.replace(/\/+$/, "");

    // 此处配置基础路由与多语言扩展
    const baseRoutes = [
      { base: "/", priority: "1.0", changefreq: "weekly" },
      { base: "/creator", priority: "0.8", changefreq: "weekly" },
    ];
    const locales = ["zh", "en"];
    const routes = [];
    for (const loc of locales) {
      for (const r of baseRoutes) {
        const pathWithLocale = r.base === "/" ? `/${loc}/` : `/${loc}${r.base}`;
        routes.push({ path: pathWithLocale, priority: r.priority, changefreq: r.changefreq });
      }
    }

    const publicDir = path.join(cwd, "public");
    ensureDir(publicDir);

    const sitemapXml = buildSitemapXml(siteUrl, routes);
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemapXml, "utf-8");

    console.log(`[sitemap] generated: ${sitemapPath}`);
  } catch (err) {
    console.error("[sitemap] generation failed:", err);
    process.exit(1);
  }
})();