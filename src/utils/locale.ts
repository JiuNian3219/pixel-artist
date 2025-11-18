import type { Locale, OgLocale } from "@/types/locale";

export const LOCALES: readonly Locale[] = ["zh", "en"] as const;
export const DEFAULT_LOCALE: Locale = "zh";

/**
 * 从路径中解析语言码
 * @param pathname 路径名（如 /zh/... 或 /en/...）
 * @returns 解析出的语言码（"zh" 或 "en"）
 */
export function parseLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "en" ? "en" : "zh";
}

/**
 * 从路径中去除语言前缀，归一到基础路径(用于SEO、生成链接)
 * @param pathname 路径名（如 /zh/... 或 /en/...）
 * @returns 归一化后的路径（如 /... 或 /...）
 */
export function stripLocaleFromPath(pathname: string): string {
  return pathname.replace(/^\/(zh|en)(\/|$)/, "/");
}

/**
 * 生成带语言前缀的路径（用于路由跳转、SEO）
 * @param locale 语言码（"zh" 或 "en"）
 * @param basePath 基础路径（如 /... 或 /...）
 * @returns 带语言前缀的路径（如 /zh/... 或 /en/...）
 */
export function withLocalePath(locale: Locale, basePath: string): string {
  const normalizedBase = basePath.startsWith("/") ? basePath : `/${basePath}`;
  if (normalizedBase === "/") return `/${locale}/`;
  return `/${locale}${normalizedBase}`;
}

/**
 * 基于浏览器语言的初始语言检测（用于根路径 / 的重定向）
 * @returns 检测到的语言码（"zh" 或 "en"）
 */
export function detectLocaleByNavigator(): Locale {
  const nav =
    (navigator.languages && navigator.languages[0]) || navigator.language || "";
  const lower = nav.toLowerCase();
  if (lower.startsWith("en")) return "en";
  return "zh";
}

/**
 * 归一化任意语言字符串到支持的 Locale
 *
 * 例如：en-US / en → en；zh-CN / zh → zh；其他全部回落到 zh
 * @param input 任意语言字符串
 * @returns 归一化后的语言码（"zh" 或 "en"）
 */
export function normalizeLocale(input: string): Locale {
  const lower = (input || "").toLowerCase();
  if (lower.startsWith("en")) return "en";
  return "zh";
}

const OG_LOCALE_MAP: Record<Locale, OgLocale> = {
  zh: "zh_CN",
  en: "en_US",
};

/**
 * 基于语言码获取 Open Graph 语言区域（用于 SEO）
 * @param locale 语言码（"zh" 或 "en"）
 * @returns Open Graph 语言区域（"zh_CN" 或 "en_US"）
 */
export function getOgLocale(locale: Locale): OgLocale {
  return OG_LOCALE_MAP[locale] || OG_LOCALE_MAP.zh;
}
