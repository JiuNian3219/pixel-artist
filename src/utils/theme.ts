import { theme } from 'antd';
import type { ThemeConfig } from 'antd/lib';

export const antdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#4f46e5',
    colorInfo: '#5c5ff5',
  },
  components: {
    Menu: {
      itemColor: 'rgb(165,172,179)',
      itemHoverColor: 'rgba(255,255,255,0.88)',
      horizontalItemSelectedBg: 'rgb(255,255,255)',
    },
    Button: {
      fontWeight: 500,
    },
  },
};
