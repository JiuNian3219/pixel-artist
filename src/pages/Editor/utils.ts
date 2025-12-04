import type { Point } from "@/types/editor";

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
 * 计算两点之间的 Bresenham 直线像素
 * @param start 起始点
 * @param end 结束点
 * @returns 直线上的所有像素点
 */
export const bresenhamLine = (start: Point, end: Point) => {
  const points: Point[] = [];
  let x0 = start.x;
  let y0 = start.y;
  const x1 = end.x;
  const y1 = end.y;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
};

/**
 * 解析颜色字符串，支持 #rrggbb、#rrggbbaa、#rgb、#rgba、rgb(...)、rgba(...) 格式
 * @param str 颜色字符串
 * @returns 解析后的 RGBA 颜色对象
 */
export const parseColorString = (
  str: string
): { r: number; g: number; b: number; a: number } => {
  if (!str) return { r: 0, g: 0, b: 0, a: 0 };
  if (str.startsWith("#")) {
    const s = str.replace("#", "");
    if (s.length === 3) {
      const r = parseInt(s[0] + s[0], 16) || 0;
      const g = parseInt(s[1] + s[1], 16) || 0;
      const b = parseInt(s[2] + s[2], 16) || 0;
      return { r, g, b, a: 255 };
    }
    if (s.length === 4) {
      const r = parseInt(s[0] + s[0], 16) || 0;
      const g = parseInt(s[1] + s[1], 16) || 0;
      const b = parseInt(s[2] + s[2], 16) || 0;
      const a = parseInt(s[3] + s[3], 16) || 255;
      return { r, g, b, a };
    }
    if (s.length === 6) {
      const r = parseInt(s.substring(0, 2), 16) || 0;
      const g = parseInt(s.substring(2, 4), 16) || 0;
      const b = parseInt(s.substring(4, 6), 16) || 0;
      return { r, g, b, a: 255 };
    }
    if (s.length === 8) {
      const r = parseInt(s.substring(0, 2), 16) || 0;
      const g = parseInt(s.substring(2, 4), 16) || 0;
      const b = parseInt(s.substring(4, 6), 16) || 0;
      const a = parseInt(s.substring(6, 8), 16) || 255;
      return { r, g, b, a };
    }
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const mRgba = str.match(
    /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (mRgba) {
    const r = parseInt(mRgba[1], 10) || 0;
    const g = parseInt(mRgba[2], 10) || 0;
    const b = parseInt(mRgba[3], 10) || 0;
    const aFloat = parseFloat(mRgba[4]) || 0;
    return {
      r,
      g,
      b,
      a: Math.max(0, Math.min(255, Math.round(aFloat * 255))),
    };
  }
  const mRgb = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (mRgb) {
    const r = parseInt(mRgb[1], 10) || 0;
    const g = parseInt(mRgb[2], 10) || 0;
    const b = parseInt(mRgb[3], 10) || 0;
    return { r, g, b, a: 255 };
  }
  return { r: 0, g: 0, b: 0, a: 0 };
};

/**
 * 检查两个 RGBA 颜色是否相等
 * @param a 第一个 RGBA 颜色对象
 * @param b 第二个 RGBA 颜色对象
 * @returns
 */
export const rgbaEqual = (
  a: { r: number; g: number; b: number; a: number },
  b: { r: number; g: number; b: number; a: number }
) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

/**
 * 获取 RGBA 颜色的对比度颜色（白色或黑色）
 * @param rgba RGBA 颜色对象
 * @returns 对比度颜色字符串（#ffffff 或 #000000）
 */
export const getContrastColorForRGBA = (rgba: {
  r: number;
  g: number;
  b: number;
  a: number;
}) => {
  // 透明区域用高可见色
  if (rgba.a < 128) return "#ff00aa";
  const lum = 0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b;
  return lum > 128 ? "#000000" : "#ffffff";
};

/**
 * 扫描线填充算法
 * @param startX 起始 X 坐标
 * @param startY 起始 Y 坐标
 * @param width 画布宽度
 * @param height 画布高度
 * @param match 匹配函数，判断坐标 (x, y) 是否应该被填充
 * @param onFill 填充回调，当坐标 (x, y) 被确认为需要填充时调用
 * @param maxPixels 最大填充像素数（可选，防止无限循环或用于预览限制）
 */
export function scanlineFloodFill(
  startX: number,
  startY: number,
  width: number,
  height: number,
  match: (x: number, y: number) => boolean,
  onFill: (x: number, y: number) => void,
  maxPixels?: number
) {
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
  if (!match(startX, startY)) return;

  const visited = new Uint8Array(width * height);
  const stack: number[] = [startX, startY];
  let filledCount = 0;

  const getIdx = (x: number, y: number) => y * width + x;

  while (stack.length > 0) {
    const y = stack.pop()!;
    let x = stack.pop()!;

    let idx = getIdx(x, y);
    if (visited[idx]) continue;

    // 向左寻找当前段的起点
    while (x > 0) {
      const leftIdx = getIdx(x - 1, y);
      if (!visited[leftIdx] && match(x - 1, y)) {
        x--;
      } else {
        break;
      }
    }

    let spanAbove = false;
    let spanBelow = false;

    // 向右扫描并填充
    while (x < width) {
      idx = getIdx(x, y);
      if (visited[idx] || !match(x, y)) break;

      // 填充当前点
      visited[idx] = 1;
      onFill(x, y);
      filledCount++;
      if (maxPixels && filledCount > maxPixels) return;

      // 检查上方行
      if (y > 0) {
        const upIdx = getIdx(x, y - 1);
        const canFillUp = !visited[upIdx] && match(x, y - 1);
        if (!spanAbove && canFillUp) {
          stack.push(x, y - 1);
          spanAbove = true;
        } else if (spanAbove && !canFillUp) {
          spanAbove = false;
        }
      }

      // 检查下方行
      if (y < height - 1) {
        const downIdx = getIdx(x, y + 1);
        const canFillDown = !visited[downIdx] && match(x, y + 1);
        if (!spanBelow && canFillDown) {
          stack.push(x, y + 1);
          spanBelow = true;
        } else if (spanBelow && !canFillDown) {
          spanBelow = false;
        }
      }

      x++;
    }
  }
}
