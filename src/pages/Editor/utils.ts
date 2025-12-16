import { parseColor } from '@/utils/parsers';

// 鼠标键位
export const MOUSE_BUTTON = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
} as const;

/**
 *  clamp 函数，用于将一个数值限制在指定的范围内
 * @param v 要限制的数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * 解析颜色字符串，支持 #rrggbb、#rrggbbaa、#rgb、#rgba、rgb(...)、rgba(...) 格式
 * @param str 颜色字符串
 * @returns 解析后的 RGBA 颜色对象
 */
export const parseColorString = (
  str: string
): { r: number; g: number; b: number; a: number } => {
  const result = parseColor(str);
  return result || { r: 0, g: 0, b: 0, a: 0 };
};

/**
 * 获取预览颜色的配置
 * 统一管理预览时的颜色逻辑（默认是 35% 透明度）
 * @param colorStr 颜色字符串
 */
export const getPreviewColor = (colorStr: string, alpha = 0.35) => {
  const { r, g, b } = parseColorString(colorStr || '#000000');
  return {
    r,
    g,
    b,
    a: Math.round(alpha * 255), // 0-255 整数，用于 ImageData
    css: `rgba(${r}, ${g}, ${b}, ${alpha})`, // CSS 字符串，用于 Canvas/DOM
  };
};
