import Layout from '@/components/Layout';
import '@/locales';
import '@/styles/index.less';
import { normalizeLocale } from '@/utils/locale';
import { antdTheme } from '@/utils/theme';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PageContext } from './types';
import { PageContextProvider } from './usePageContext';

const antdLocaleMap = {
  zh: zhCN,
  en: enUS,
} as const;

/**
 * 页面外壳组件
 * @param props 页面外壳组件属性
 * @param props.pageContext 页面上下文
 * @param props.children 页面子元素
 * @returns
 */
export function PageShell({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  const locale = pageContext.routeParams.locale;
  if (locale && i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  const currentLocale = normalizeLocale(locale || i18n.language || 'zh');
  const antdLocale =
    antdLocaleMap[currentLocale as keyof typeof antdLocaleMap] || zhCN;

  return (
    <PageContextProvider pageContext={pageContext}>
      <ConfigProvider theme={antdTheme} locale={antdLocale}>
        <Layout>{children}</Layout>
      </ConfigProvider>
    </PageContextProvider>
  );
}
