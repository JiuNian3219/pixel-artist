/**
 * 将像素化后的图片 dataURL 解析为网格像素颜色映射
 * 返回仅包含有颜色的格子（透明不记录），键为 "x,y"，值为 CSS 颜色字符串：
 * - 不透明：`rgb(r, g, b)`
 * - 半透明：`rgba(r, g, b, a)`
 * @param dataUrl 像素化后的图片 dataURL
 * @param rows 网格行数
 * @param columns 网格列数
 * @param pixelSize 每个像素的大小（像素化后的图片中每个像素的实际像素尺寸）
 * @returns 网格像素颜色映射
 */
export const parseDataUrlToGridPixels = async (
  dataUrl: string,
  rows: number,
  columns: number,
  pixelSize: number
): Promise<Record<string, string>> => {
  const img = await loadImage(dataUrl);

  const off = document.createElement("canvas");
  off.width = img.naturalWidth;
  off.height = img.naturalHeight;
  const ctx = off.getContext("2d");
  if (!ctx) return {};
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0);

  const whole = ctx.getImageData(0, 0, off.width, off.height);
  const data = whole.data;
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
  const centerOffset = Math.floor(Math.max(1, pixelSize) / 2);

  const out: Record<string, string> = {};
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let sx = x * pixelSize + centerOffset;
      let sy = y * pixelSize + centerOffset;
      sx = clamp(sx, 0, off.width - 1);
      sy = clamp(sy, 0, off.height - 1);
      const idx = (sy * off.width + sx) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if (a === 0) continue; // 透明不记录
      const alpha = a / 255;
      const fill =
        a === 255
          ? `rgb(${r}, ${g}, ${b})`
          : `rgba(${r}, ${g}, ${b}, ${alpha})`;
      out[`${x},${y}`] = fill;
    }
  }

  return out;
};

/**
 * 将数字转换为十六进制字符串，不足两位用前导零填充
 * @param n 数字
 * @returns 十六进制字符串
 */
export const toHex = (n: number) => n.toString(16).padStart(2, "0");

/**
 * 加载图片并返回 Promise，图片加载完成后解析为 HTMLImageElement
 * @param src 图片 URL
 * @returns 图片元素 Promise
 */
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
