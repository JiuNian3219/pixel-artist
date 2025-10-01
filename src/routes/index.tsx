import Layout from "@/components/Layout";
import Creator from "@/pages/Creator";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/creator",
        element: <Creator />,
      },
      {
        path: "/404",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
