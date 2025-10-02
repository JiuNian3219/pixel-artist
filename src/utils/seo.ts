interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  robots?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const siteUrl = import.meta.env.VITE_SITE_URL || "";

export const seoConfigs: Record<string, SEOConfig> = {
  "/": {
    title: "Pixel Artist - 像素艺术创作工具",
    description:
      "使用Pixel Artist将您的图片转换为有质感的像素艺术作品，简单易用的在线像素画创作工具。Transform your images into textured pixel art with Pixel Artist.",
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
  "/creator": {
    title: "Pixel Artist - 在线像素艺术创作工具",
    description:
      "Pixel Artist是一款强大的在线像素艺术创作工具，通过图片转换，让您轻松创建精美的像素艺术作品。Powerful online pixel art creation tool.",
    keywords:
      "像素艺术,在线像素画,像素画创作,像素画转换,pixel art,online pixel art,pixel art creation",
    ogImage: `${siteUrl}/creator-page.jpg`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: `${siteUrl}/creator`,
      name: "Pixel Artist - Creator",
    },
  },
  "/404": {
    title: "404 - Pixel Artist",
    description: "页面未找到。Page not found.",
    robots: "noindex,nofollow",
  },
};

export const getDefaultSEO = (): SEOConfig => ({
  title: "404 页面未找到 - Pixel Artist",
  description: "抱歉，您访问的页面不存在。",
  robots: "noindex,nofollow",
});
