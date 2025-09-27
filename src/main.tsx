import router from "@/routes";
import "@/styles/index.less";
import { antdTheme } from "@/utils/theme";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Analytics from "./components/Analytics";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={antdTheme}
      locale={zhCN}
    >
      <Analytics />
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
