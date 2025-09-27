import { useEffect } from "react";

const Analytics = () => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      import.meta.env.MODE === "production"
    ) {
      const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
      const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;

      if (websiteId && scriptUrl) {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.setAttribute("data-website-id", websiteId);
        script.src = scriptUrl;

        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
        };
      }
    }
  }, []);

  return null;
};

export default Analytics;
