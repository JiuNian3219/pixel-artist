import '@/locales';
import router from '@/routes';
import { antdTheme } from '@/utils/theme';
import { normalizeLocale } from '@/utils/locale';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import Analytics from '../Analytics';

const antdLocaleMap = {
  zh: zhCN,
  en: enUS,
} as const;

const App = () => {
  const { i18n } = useTranslation();

  const currentLocale = normalizeLocale(i18n.language);
  const antdLocale = antdLocaleMap[currentLocale] || zhCN;

  return (
    <ConfigProvider theme={antdTheme} locale={antdLocale}>
      <Analytics />
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
