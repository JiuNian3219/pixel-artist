export { onBeforePrerenderStart };

let hasProvidedUrls = false;

async function onBeforePrerenderStart() {
  if (hasProvidedUrls) {
    return [];
  }

  const locales = ['zh', 'en'];
  const urls: string[] = [];

  locales.forEach((locale) => {
    urls.push(`/${locale}`);
    urls.push(`/${locale}/creator`);
    urls.push(`/${locale}/editor`);
  });

  const uniqueUrls = [...new Set(urls)];

  hasProvidedUrls = true;

  return uniqueUrls;
}
