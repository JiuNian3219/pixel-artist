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

function buildBingAuthXml(user) {
  return `<?xml version="1.0"?>
<users>
	<user>${user}</user>
</users>`;
}

(async () => {
  try {
    const mode = getModeArg() || process.env.NODE_ENV || "production";
    const env = loadEnv(mode, cwd, "");

    const bingUser = env.BING_SITE_AUTH_USER;

    if (!bingUser) {
      return;
    }

    const publicDir = path.join(cwd, "public");
    ensureDir(publicDir);

    const xmlContent = buildBingAuthXml(bingUser);
    const filePath = path.join(publicDir, "BingSiteAuth.xml");
    fs.writeFileSync(filePath, xmlContent, "utf-8");

    console.log(`[BingSiteAuth] generated: ${filePath}`);
  } catch (err) {
    console.error("[BingSiteAuth] generation failed:", err);
    process.exit(1);
  }
})();
