export { onBeforePrerenderStart };

async function onBeforePrerenderStart() {
  const locales = ['zh', 'en'];
  const urls: string[] = [];

  locales.forEach((locale) => {
    urls.push(`/${locale}`);
    urls.push(`/${locale}/creator`);
    urls.push(`/${locale}/editor`);
  });

  return urls;
}
