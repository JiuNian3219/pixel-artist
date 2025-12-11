import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// 中文语言包
import zh404 from './zh/404.json';
import zhCommon from './zh/common.json';
import zhCreator from './zh/creator.json';
import zhEditor from './zh/editor.json';
import zhHome from './zh/home.json';

// 英文语言包
import en404 from './en/404.json';
import enCommon from './en/common.json';
import enCreator from './en/creator.json';
import enEditor from './en/editor.json';
import enHome from './en/home.json';

const resources = {
  zh: {
    common: zhCommon,
    home: zhHome,
    creator: zhCreator,
    editor: zhEditor,
    '404': zh404,
  },
  en: {
    common: enCommon,
    home: enHome,
    creator: enCreator,
    editor: enEditor,
    '404': en404,
  },
};

// 仅在客户端使用语言检测器
if (typeof window !== 'undefined') {
  i18n.use(LanguageDetector);
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'zh',
  defaultNS: 'common',

  detection: {
    // 优先路径，其次浏览器语言（主要用于以/目录进入时确定网页语言）
    order: ['path', 'navigator'],
    lookupFromPathIndex: 0,
  },

  supportedLngs: ['zh', 'en'],
  load: 'languageOnly',

  interpolation: {
    escapeValue: false,
  },

  // 开发环境显示调试信息
  debug: import.meta.env.DEV,
});

export default i18n;
