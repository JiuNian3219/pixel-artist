import "@/styles/index.less";
import "@ant-design/v5-patch-for-react-19";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./components/App";
import "./locales";

const container = document.getElementById("root")!;

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
