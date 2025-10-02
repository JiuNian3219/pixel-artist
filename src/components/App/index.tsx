import "@/locales";
import router from "@/routes";
import { antdTheme } from "@/utils/theme";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import Analytics from "../Analytics";

const antdLocaleMap = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

const App = () => {
  const { i18n } = useTranslation();

  const antdLocale =
    antdLocaleMap[i18n.language as keyof typeof antdLocaleMap] || zhCN;

  return (
    <ConfigProvider
      theme={antdTheme}
      locale={antdLocale}
    >
      <Analytics />
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
