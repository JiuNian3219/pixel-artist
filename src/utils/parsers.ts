/**
 * 通用解析工具函数
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * 解析 "x,y" 格式的坐标字符串
 * @param key 坐标字符串，如 "10,20"
 * @returns [x, y] 坐标数组
 */
export const parseCoordinates = (key: string): [number, number] => {
  const parts = key.split(',');
  if (parts.length !== 2) return [0, 0];
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
};

/**
 * 解析单个十六进制字符并重复一次作为字节值
 * @deprecated 内部辅助函数，尽量不直接导出使用
 */
export const parseHexByte = (str: string): number => {
  return parseInt(str, 16) || 0;
};

/**
 * 解析任意长度的 Hex 颜色字符串 (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
 * @param hex hex 字符串
 * @returns RGBA 对象 {r, g, b, a}，失败返回 null
 */
export const parseHexColor = (hex: string): RGBA | null => {
  const s = hex.startsWith('#') ? hex.slice(1) : hex;
  let expanded = s;

  // 扩展简写形式：3位或4位 -> 6位或8位
  if (s.length === 3 || s.length === 4) {
    expanded = s
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (expanded.length !== 6 && expanded.length !== 8) {
    return null;
  }

  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  const a = expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) : 255;

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }

  return { r, g, b, a };
};

/**
 * 解析 rgb/rgba 颜色字符串
 * @param str rgb/rgba 字符串
 * @returns RGBA 对象 {r, g, b, a}，解析失败返回 null
 */
export const parseRgbString = (str: string): RGBA | null => {
  if (!str.startsWith('rgb')) {
    return null;
  }

  const nums = str.match(/(\d+(\.\d+)?)/g);
  if (!nums || nums.length < 3) {
    return null;
  }

  const r = parseInt(nums[0], 10);
  const g = parseInt(nums[1], 10);
  const b = parseInt(nums[2], 10);
  let a = 255;

  if (nums.length > 3) {
    const alphaVal = parseFloat(nums[3]);
    // 兼容 0-1 (float) 和 0-255 (int)
    a = alphaVal <= 1 ? Math.round(alphaVal * 255) : Math.round(alphaVal);
  }

  return { r, g, b, a };
};

/**
 * 通用颜色解析，自动识别 Hex 或 RGB/RGBA
 * @param str 颜色字符串
 * @returns RGBA 对象或 null
 */
export const parseColor = (str: string): RGBA | null => {
  if (!str) return null;
  if (str.startsWith('#')) return parseHexColor(str);
  if (str.startsWith('rgb')) return parseRgbString(str);
  return null;
};

/**
 * 将 Hex 颜色字符串转换为 32 位整数 (ABGR 格式，Little Endian 下内存为 RGBA)
 * 支持 #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(...), rgba(...)
 * @param str 颜色字符串
 * @returns 32 位整数 (ABGR 格式)，解析失败返回 0
 */
export const hexToUint32 = (str: string): number => {
  const rgba = parseColor(str);
  if (!rgba) return 0;

  const { r, g, b, a } = rgba;
  // Little Endian: 0xAABBGGRR -> Memory: R G B A
  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
};

/**
 * 将 32 位整数转换为 Hex 字符串 (#RRGGBBAA)
 * @param val 32 位整数
 * @returns Hex 字符串，透明像素返回空字符串
 */
export const uint32ToHex = (val: number): string => {
  if (val === 0) return '';

  // Little Endian: ABGR -> R G B A
  const r = val & 0xff;
  const g = (val >> 8) & 0xff;
  const b = (val >> 16) & 0xff;
  const a = (val >> 24) & 0xff;

  if (a === 0) return '';

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a
    .toString(16)
    .padStart(2, '0')}`;
};
