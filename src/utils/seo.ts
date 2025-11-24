import type { Locale } from "@/types/locale";
import type { PageKey, SEOConfig } from "@/types/seo";

const siteUrl = import.meta.env.VITE_SITE_URL || "";

// 基于基础路径的多语言 SEO 配置
const localizedSEO: Record<PageKey, Record<Locale, SEOConfig>> = {
  "/": {
    zh: {
      title: "Pixel Artist - 像素艺术创作工具",
      description:
        "使用 Pixel Artist 将图片转换为有质感的像素艺术作品，简单易用的在线像素画创作工具。",
      keywords:
        "像素画,像素艺术,像素编辑器,在线像素画,像素创作,pixel art,pixel editor,online pixel art",
      ogImage: `${siteUrl}/home-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: siteUrl,
        name: "Pixel Artist",
      },
    },
    en: {
      title: "Pixel Artist - Pixel Art Creator",
      description:
        "Turn images into textured pixel art with a simple, powerful online tool.",
      keywords:
        "pixel art,pixel editor,online pixel art,pixel art creator,image to pixel art",
      ogImage: `${siteUrl}/home-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: siteUrl,
        name: "Pixel Artist",
      },
    },
  },
  "/creator": {
    zh: {
      title: "Pixel Artist - 在线像素艺术创作工具",
      description: "通过图片转换与调色板映射，轻松创作精美像素艺术作品。",
      keywords:
        "像素艺术,在线像素画,像素画创作,像素画转换,pixel art,online pixel art",
      ogImage: `${siteUrl}/creator-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${siteUrl}/creator`,
        name: "Pixel Artist - Creator",
      },
    },
    en: {
      title: "Pixel Artist - Online Pixel Art Creator",
      description:
        "Create beautiful pixel art from images with palette mapping and controls.",
      keywords:
        "pixel art,online pixel art,pixel art creator,image pixelation,color palette",
      ogImage: `${siteUrl}/creator-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${siteUrl}/creator`,
        name: "Pixel Artist - Creator",
      },
    },
  },
  "/editor": {
    zh: {
      title: "Pixel Artist - 像素艺术编辑工具",
      description:
        "使用像素编辑器编辑像素艺术作品，简单易用的在线像素画编辑工具。",
      keywords:
        "像素编辑器,像素艺术编辑,在线像素编辑器,像素画编辑,pixel editor,pixel art editor",
      ogImage: `${siteUrl}/editor-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${siteUrl}/editor`,
        name: "Pixel Artist - Editor",
      },
    },
    en: {
      title: "Pixel Artist - Pixel Art Editor",
      description: "Edit pixel art works with a simple, powerful online tool.",
      keywords:
        "pixel editor,pixel art editor,online pixel editor,pixel art editing",
      ogImage: `${siteUrl}/editor-page.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${siteUrl}/editor`,
        name: "Pixel Artist - Editor",
      },
    },
  },
  "/404": {
    zh: {
      title: "404 - Pixel Artist",
      description: "页面未找到。",
      robots: "noindex,nofollow",
    },
    en: {
      title: "404 - Pixel Artist",
      description: "Page not found.",
      robots: "noindex,nofollow",
    },
  },
};

export const getDefaultSEO = (): SEOConfig => ({
  title: "404 - Pixel Artist",
  description: "页面未找到。Page not found.",
  robots: "noindex,nofollow",
});

// 根据当前路径与语言解析 SEO 配置
export function normalizeBasePath(pathname: string): PageKey | string {
  return pathname.replace(/^\/(zh|en)(\/|$)/, "/") as PageKey;
}

export const resolveSEOByPath = (
  pathname: string,
  locale: Locale
): SEOConfig => {
  const basePath = normalizeBasePath(pathname) as PageKey;
  const table = localizedSEO[basePath];
  if (!table) return getDefaultSEO();
  return table[locale] || table.zh;
};

export function getAlternateLinks(
  siteUrl: string,
  basePath: string
): Array<{ href: string; hreflang: string }> {
  return [
    { href: `${siteUrl}/zh${basePath}`, hreflang: "zh" },
    { href: `${siteUrl}/en${basePath}`, hreflang: "en" },
    { href: `${siteUrl}${basePath}`, hreflang: "x-default" },
  ];
}
