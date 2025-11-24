import CenterSpin from "@/components/CenterSpin";
import Layout from "@/components/Layout";
import { DEFAULT_LOCALE, LOCALES } from "@/utils/locale";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootRedirect from "./RootRedirect";
const Creator = lazy(() => import("@/pages/Creator"));
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Editor = lazy(() => import("@/pages/Editor"));

// 基于 LOCALES 自动生成多语言路由分组
const localeRoutes = LOCALES.map((lng) => ({
  path: `/${lng}`,
  element: <Layout />,
  errorElement: (
    <Suspense fallback={<CenterSpin style={{ marginTop: "100px" }} />}>
      <NotFound />
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<CenterSpin style={{ marginTop: "100px" }} />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "creator",
      element: (
        <Suspense fallback={<CenterSpin style={{ marginTop: "100px" }} />}>
          <Creator />
        </Suspense>
      ),
    },
    {
      path: "editor",
      element: (
        <Suspense fallback={<CenterSpin style={{ marginTop: "100px" }} />}>
          <Editor />
        </Suspense>
      ),
    },
    {
      path: "404",
      element: (
        <Suspense fallback={<CenterSpin style={{ marginTop: "100px" }} />}>
          <NotFound />
        </Suspense>
      ),
    },
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
