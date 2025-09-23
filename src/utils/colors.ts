export const colors = {
  primary: {
    100: "#6366F1", // 现代紫蓝
    200: "#4F46E5", // 深紫蓝
    300: "#3730A3", // 深邃紫
  },
  accent: {
    100: "#06B6D4", // 明亮青色
    200: "#0891B2", // 深青色
  },
  secondary: {
    100: "#EC4899", // 艺术粉
    200: "#BE185D", // 深粉红
  },
  success: {
    100: "#10B981", // 翠绿色
  },
  warning: {
    100: "#F59E0B", // 琥珀色
  },
  text: {
    100: "#1F2937", // 主文本
    200: "#4B5563", // 次要文本
    300: "#6B7280", // 辅助文本
  },
  bg: {
    100: "#FFFFFF", // 纯白背景
    200: "#F9FAFB", // 浅灰背景
    300: "#F3F4F6", // 中性背景
    400: "#E5E7EB", // 边界背景
  },
  special: {
    gradientStart: "#6366F1",
    gradientEnd: "#06B6D4",
    shadow: "rgba(99, 102, 241, 0.1)",
  },
} as const;

// CSS变量名称映射
export const cssVars = {
  primary: {
    100: "var(--primary-100)",
    200: "var(--primary-200)",
    300: "var(--primary-300)",
  },
  accent: {
    100: "var(--accent-100)",
    200: "var(--accent-200)",
  },
  secondary: {
    100: "var(--secondary-100)",
    200: "var(--secondary-200)",
  },
  success: {
    100: "var(--success-100)",
  },
  warning: {
    100: "var(--warning-100)",
  },
  text: {
    100: "var(--text-100)",
    200: "var(--text-200)",
    300: "var(--text-300)",
  },
  bg: {
    100: "var(--bg-100)",
    200: "var(--bg-200)",
    300: "var(--bg-300)",
    400: "var(--bg-400)",
  },
  special: {
    gradientStart: "var(--gradient-start)",
    gradientEnd: "var(--gradient-end)",
    shadow: "var(--shadow-color)",
  },
} as const;

// 类型定义
export type ColorKey = keyof typeof colors;
export type ColorVariant =
  | keyof typeof colors.primary
  | keyof typeof colors.accent
  | keyof typeof colors.secondary
  | keyof typeof colors.text
  | keyof typeof colors.bg;
