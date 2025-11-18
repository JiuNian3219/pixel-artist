import Layout from "@/components/Layout";
import Creator from "@/pages/Creator";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { DEFAULT_LOCALE, LOCALES } from "@/utils/locale";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootRedirect from "./RootRedirect";

// 基于 LOCALES 自动生成多语言路由分组
const localeRoutes = LOCALES.map((lng) => ({
  path: `/${lng}`,
  element: <Layout />,
  errorElement: <NotFound />,
  children: [
    { index: true, element: <Home /> },
    { path: "creator", element: <Creator /> },
    { path: "404", element: <NotFound /> },
  ],
}));

const router = createBrowserRouter([
  ...localeRoutes,
  { path: "/", element: <RootRedirect /> },
  {
    path: "*",
    element: (
      <Navigate
        to={`/${DEFAULT_LOCALE}/404`}
        replace
      />
    ),
  },
]);

export default router;
