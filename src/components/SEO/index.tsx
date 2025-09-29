import React from "react";

interface SEOProps {
  /** 页面标题；用于 <title> 与 og:title */
  title: string;
  /** 页面描述；用于 meta description 与 og:description */
  description?: string;
  /** 关键词标签（可选）；现代搜索引擎基本忽略 */
  keywords?: string;
  /** 社交分享预览图的绝对 URL；建议尺寸 1200x630 */
  ogImage?: string;
  /** 规范链接（canonical）；不传则自动用 VITE_SITE_URL + pathname */
  canonicalUrl?: string;
  /** 站点品牌名；用于 og:site_name */
  siteName?: string;
  /** 页面语言区域；默认 zh_CN；用于 og:locale */
  locale?: string;
  /** Twitter 站点账号（如 @your_handle）；用于 twitter:site */
  twitterSite?: string;
  /** 结构化数据（JSON‑LD）；可传对象或对象数组 */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /** robots 指令（如 "index,follow" 或 "noindex,nofollow"） */
  robots?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  siteName,
  locale = "zh_CN",
  twitterSite,
  jsonLd,
  robots,
}) => {
  const siteUrl =
    (import.meta as any).env?.VITE_SITE_URL?.replace(/\/+$/, "") || "";
  const autoCanonical =
    siteUrl && typeof window !== "undefined"
      ? `${siteUrl}${window.location.pathname}`
      : undefined;
  const finalCanonical = canonicalUrl || autoCanonical;

  return (
    <>
      <title>{title}</title>
      {description && (
        <meta
          name="description"
          content={description}
        />
      )}
      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:title"
        content={title}
      />
      {siteName && (
        <meta
          property="og:site_name"
          content={siteName}
        />
      )}
      {locale && (
        <meta
          property="og:locale"
          content={locale}
        />
      )}
      {description && (
        <meta
          property="og:description"
          content={description}
        />
      )}
      {ogImage && (
        <meta
          property="og:image"
          content={ogImage}
        />
      )}

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      {twitterSite && (
        <meta
          name="twitter:site"
          content={twitterSite}
        />
      )}

      {/* Canonical */}
      {finalCanonical && (
        <link
          rel="canonical"
          href={finalCanonical}
        />
      )}

      {/* Robots */}
      {robots && (
        <meta
          name="robots"
          content={robots}
        />
      )}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {Array.isArray(jsonLd)
            ? JSON.stringify(jsonLd)
            : JSON.stringify(jsonLd)}
        </script>
      )}
    </>
  );
};

export default SEO;
