import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// 中文语言包
import zhCommon from "./zh/common.json";
import zhCreator from "./zh/creator.json";
import zhHome from "./zh/home.json";

// 英文语言包
import enCommon from "./en/common.json";
import enCreator from "./en/creator.json";
import enHome from "./en/home.json";

const resources = {
  zh: {
    common: zhCommon,
    home: zhHome,
    creator: zhCreator,
  },
  en: {
    common: enCommon,
    home: enHome,
    creator: enCreator,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh",
    defaultNS: "common",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "pixel-artist-language",
    },

    interpolation: {
      escapeValue: false,
    },

    // 开发环境显示调试信息
    debug: import.meta.env.DEV,
  });

export default i18n;
