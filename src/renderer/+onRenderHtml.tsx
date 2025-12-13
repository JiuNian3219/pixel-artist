import logo from '@/assets/logo.svg';
import i18n from '@/locales';
import type { Locale } from '@/types/locale';
import { getOgLocale } from '@/utils/locale';
import { getDefaultSEO, resolveSEOByPath } from '@/utils/seo';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import { PageShell } from './PageShell';
import type { PageContextServer } from './types';

export const onRenderHtml = async (pageContext: PageContextServer) => {
  const { Page, pageProps } = pageContext;

  const locale = (pageContext.routeParams.locale as Locale) || 'zh';
  if (locale && i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }

  let pageHtml = '';
  let styleText = '';

  const ssr = pageContext.config.ssr !== false;

  if (ssr && Page) {
    // AntD 样式缓存
    const cache = createCache();

    pageHtml = ReactDOMServer.renderToString(
      <StyleProvider cache={cache}>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </StyleProvider>
    );

    // 提取 AntD 样式
    styleText = extractStyle(cache);
  }

  const seo =
    resolveSEOByPath(pageContext.urlPathname, locale) || getDefaultSEO();
  const title = seo.title;
  const description = seo.description || 'Online Pixel Art Editor';
  const ogImage = seo.ogImage;
  const keywords = seo.keywords;

  const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const umamiScriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${locale}">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="${logo}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        ${keywords ? escapeInject`<meta name="keywords" content="${keywords}" />` : ''}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:locale" content="${getOgLocale(locale)}" />
        ${ogImage ? escapeInject`<meta property="og:image" content="${ogImage}" />` : ''}
        <style>${dangerouslySkipEscape(styleText)}</style>
        ${
          import.meta.env.PROD && umamiWebsiteId && umamiScriptUrl
            ? escapeInject`<script defer src="${umamiScriptUrl}" data-website-id="${umamiWebsiteId}"></script>`
            : ''
        }
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
};
