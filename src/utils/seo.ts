import type { Locale } from '@/types/locale';
import type { PageKey, SEOConfig } from '@/types/seo';

const siteUrl = import.meta.env.VITE_SITE_URL || '';

// 基于基础路径的多语言 SEO 配置
const localizedSEO: Record<PageKey, Record<Locale, SEOConfig>> = {
  '/': {
    zh: {
      title: 'Pixel Artist - 在线像素画生成器 & 编辑器 | 免费好用',
      description:
        'Pixel Artist 是一款免费的在线像素艺术创作工具。支持将图片一键转换为像素画（Image to Pixel Art），提供专业的像素编辑器、自定义调色板和去抖动算法。适合游戏开发、NFT创作及像素艺术爱好者。',
      keywords:
        '像素画,像素艺术,在线像素编辑器,图片转像素,像素画生成器,8bit生成器,sprite工具,游戏素材制作,pixel art,pixel editor,online pixel art,image to pixel',
      ogImage: `${siteUrl}/home-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Pixel Artist',
        url: siteUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A powerful online pixel art creation tool that converts images to pixel art and provides a full-featured editor.',
      },
    },
    en: {
      title: 'Pixel Artist - Free Online Pixel Art Maker & Editor',
      description:
        'Convert images to pixel art instantly with Pixel Artist. A free, powerful online tool featuring palette control, dithering, and a full pixel editor. Perfect for game devs, sprite artists, and hobbyists.',
      keywords:
        'pixel art,pixel editor,online pixel art,pixel art creator,image to pixel art,8bit maker,sprite editor,game assets,photo to pixel,pixelate image',
      ogImage: `${siteUrl}/home-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Pixel Artist',
        url: siteUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A powerful online pixel art creation tool that converts images to pixel art and provides a full-featured editor.',
      },
    },
  },
  '/creator': {
    zh: {
      title: 'Creator - 图片转像素画工具 | Pixel Artist',
      description:
        '强大的图片像素化工具。上传图片，选择调色板，调整像素大小，应用抖动算法，一键生成高质量像素画。支持导出 PNG 和继续编辑。',
      keywords:
        '图片转像素,像素化工具,照片转8bit,像素转换器,抖动算法,调色板映射,image pixelation,pixel art converter',
      ogImage: `${siteUrl}/creator-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        url: `${siteUrl}/creator`,
        name: 'Pixel Artist - Image to Pixel Converter',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        featureList:
          'Image to Pixel Art conversion, Dithering algorithms, Palette management',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    },
    en: {
      title: 'Creator - Image to Pixel Art Converter | Pixel Artist',
      description:
        'Best free tool to pixelate images. Upload your photo, choose a palette, apply dithering, and create stunning pixel art. Export as PNG or edit further.',
      keywords:
        'image to pixel art,photo pixelator,pixel art converter,8bit filter,dithering tool,palette mapper,pixelate image',
      ogImage: `${siteUrl}/creator-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        url: `${siteUrl}/creator`,
        name: 'Pixel Artist - Image to Pixel Converter',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        featureList:
          'Image to Pixel Art conversion, Dithering algorithms, Palette management',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    },
  },
  '/editor': {
    zh: {
      title: 'Editor - 在线像素画编辑器 | Pixel Artist',
      description:
        '专业级在线像素画编辑器。支持图层、笔刷、取色器、撤销重做及网格显示。无需下载，浏览器即开即用，是制作游戏 Sprite 和像素头像的最佳工具。',
      keywords:
        '像素编辑器,在线绘图工具,像素画软件,sprite编辑器,游戏美术工具,在线PS,pixel editor,online drawing tool',
      ogImage: `${siteUrl}/editor-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        url: `${siteUrl}/editor`,
        name: 'Pixel Artist - Pixel Editor',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        featureList: 'Layer support, Custom brushes, Grid view, PNG export',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    },
    en: {
      title: 'Editor - Online Pixel Art Editor | Pixel Artist',
      description:
        'Professional online pixel art editor. Features layers, brushes, color picker, undo/redo, and grid view. No download required. Create game sprites and pixel art instantly.',
      keywords:
        'pixel editor,online pixel art tool,sprite editor,browser based drawing,pixel art software,game sprite maker',
      ogImage: `${siteUrl}/editor-page.jpg`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        url: `${siteUrl}/editor`,
        name: 'Pixel Artist - Pixel Editor',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web Browser',
        featureList: 'Layer support, Custom brushes, Grid view, PNG export',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    },
  },
  '/404': {
    zh: {
      title: '404 - Pixel Artist',
      description: '页面未找到。',
      robots: 'noindex,nofollow',
    },
    en: {
      title: '404 - Pixel Artist',
      description: 'Page not found.',
      robots: 'noindex,nofollow',
    },
  },
};

export const getDefaultSEO = (): SEOConfig => ({
  title: '404 - Pixel Artist',
  description: '页面未找到。Page not found.',
  robots: 'noindex,nofollow',
});

// 根据当前路径与语言解析 SEO 配置
export function normalizeBasePath(pathname: string): PageKey | string {
  return pathname.replace(/^\/(zh|en)(\/|$)/, '/') as PageKey;
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
    { href: `${siteUrl}/zh${basePath}`, hreflang: 'zh' },
    { href: `${siteUrl}/en${basePath}`, hreflang: 'en' },
    { href: `${siteUrl}${basePath}`, hreflang: 'x-default' },
  ];
}
