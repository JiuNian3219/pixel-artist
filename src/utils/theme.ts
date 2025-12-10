import { theme } from 'antd';
import type { ThemeConfig } from 'antd/lib';

// 专业现代艺术主题配置
export const antdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 主色调
    // 全局主题色
    colorPrimary: '#6366F1',
    // 成功状态色
    colorSuccess: '#10B981',
    // 警告状态色
    colorWarning: '#F59E0B',
    // 错误状态色
    colorError: '#EF4444',
    // 信息状态色
    colorInfo: '#3B82F6',

    // 文本色
    // 主要文本色
    colorText: '#1F2937',
    // 次要文本色
    colorTextSecondary: '#4B5563',
    // 第三级文本色
    colorTextTertiary: '#6B7280',
    // 第四级文本色
    colorTextQuaternary: '#9CA3AF',

    // 背景色
    // 容器背景色
    colorBgContainer: '#FFFFFF',
    // 浮层背景色
    colorBgElevated: '#FFFFFF',
    // 布局背景色
    colorBgLayout: '#F9FAFB',
    // 聚光背景色
    colorBgSpotlight: '#F3F4F6',
    // 遮罩层背景色
    colorBgMask: 'rgba(0, 0, 0, 0.45)',

    // 边框色
    // 主要边框色
    colorBorder: '#E5E7EB',
    // 次要边框色
    colorBorderSecondary: '#F3F4F6',

    // 链接色
    // 链接默认色
    colorLink: '#6366F1',
    // 链接悬浮色
    colorLinkHover: '#4F46E5',
    // 链接激活色
    colorLinkActive: '#3730A3',

    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // 字体
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,

    // 阴影
    boxShadow:
      '0 1px 3px 0 rgba(99, 102, 241, 0.1), 0 1px 2px 0 rgba(99, 102, 241, 0.06)',
    boxShadowSecondary:
      '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',

    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
  },
  components: {
    Button: {
      colorPrimary: '#6366F1',
      colorPrimaryHover: '#4F46E5',
      colorPrimaryTextHover: '4f46e5',
      colorPrimaryActive: '#3730A3',
      borderRadius: 8,
      fontWeight: 500,
    },
    Input: {
      colorPrimary: '#6366F1',
      colorPrimaryHover: '#4F46E5',
      activeBorderColor: '#6366F1',
      hoverBorderColor: '#4F46E5',
      borderRadius: 8,
    },
    Select: {
      colorPrimary: '#6366F1',
      colorPrimaryHover: '#4F46E5',
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadow:
        '0 1px 3px 0 rgba(99, 102, 241, 0.1), 0 1px 2px 0 rgba(99, 102, 241, 0.06)',
    },
    Menu: {
      itemColor: 'rgba(255,255,255,0.65)',
      itemSelectedBg: '#F0F0FF',
      itemSelectedColor: '#6366F1',
      itemHoverColor: '#4F46E5',
      borderRadius: 6,
    },
    Tabs: {
      itemSelectedColor: '#6366F1',
      itemHoverColor: '#4F46E5',
      inkBarColor: '#6366F1',
    },
    Progress: {
      defaultColor: '#6366F1',
    },
    Tag: {
      borderRadius: 6,
    },
    Notification: {
      colorBgElevated: '#FFFFFF',
      borderRadius: 12,
      boxShadow:
        '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
    },
    Message: {
      colorBgElevated: '#FFFFFF',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    Alert: {
      borderRadius: 8,
      colorSuccessBg: '#D1FAE5',
      colorSuccessBorder: '#A7F3D0',
      colorWarningBg: '#FEF3C7',
      colorWarningBorder: '#FDE68A',
      colorErrorBg: '#FEE2E2',
      colorErrorBorder: '#FECACA',
      colorInfoBg: '#DBEAFE',
      colorInfoBorder: '#BFDBFE',
    },
    Tooltip: {
      colorBgSpotlight: '#1F2937',
      borderRadius: 6,
    },
    Popover: {
      colorBgElevated: '#FFFFFF',
      borderRadius: 8,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
};
