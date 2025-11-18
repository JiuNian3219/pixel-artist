interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * 平均色采样，计算像素块的平均颜色
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param startX 起始X坐标
 * @param startY 起始Y坐标
 * @param pixelSize 像素大小
 * @returns 平均颜色
 */
const getAverageColor = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  let count = 0;

  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
      r += data[pixelIndex];
      g += data[pixelIndex + 1];
      b += data[pixelIndex + 2];
      a += data[pixelIndex + 3];
      count++;
    }
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
    a: Math.round(a / count),
  };
};

/**
 * 主色采样，获取指定区域内的主要颜色
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param startX 起始X坐标
 * @param startY 起始Y坐标
 * @param pixelSize 像素大小
 * @returns 主要颜色
 */
const getDominantColor = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  const colorMap = new Map<string, { color: Color; count: number }>();

  // 统计颜色频率
  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const a = data[pixelIndex + 3];

      // 量化颜色减少噪声
      const quantizedR = Math.round(r / 16) * 16;
      const quantizedG = Math.round(g / 16) * 16;
      const quantizedB = Math.round(b / 16) * 16;

      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

      if (colorMap.has(colorKey)) {
        colorMap.get(colorKey)!.count++;
      } else {
        colorMap.set(colorKey, {
          color: { r: quantizedR, g: quantizedG, b: quantizedB, a },
          count: 1,
        });
      }
    }
  }

  // 找到出现次数最多的颜色
  let dominantColor = { r: 0, g: 0, b: 0, a: 255 };
  let maxCount = 0;

  for (const { color, count } of colorMap.values()) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  }

  return dominantColor;
};

/**
 * 加权平均色采样（根据亮度权重），计算像素块的加权平均颜色
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param startX 起始X坐标
 * @param startY 起始Y坐标
 * @param pixelSize 像素大小
 * @returns 加权平均颜色
 */
const getWeightedAverageColorByLuminance = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  let totalWeight = 0;

  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
      const pixelR = data[pixelIndex];
      const pixelG = data[pixelIndex + 1];
      const pixelB = data[pixelIndex + 2];
      const pixelA = data[pixelIndex + 3];

      // 计算亮度权重
      const luminance = 0.299 * pixelR + 0.587 * pixelG + 0.114 * pixelB;
      const weight = Math.pow(luminance / 255, 0.5); // 可调整指数

      r += pixelR * weight;
      g += pixelG * weight;
      b += pixelB * weight;
      a += pixelA * weight;
      totalWeight += weight;
    }
  }

  return {
    r: Math.round(r / totalWeight),
    g: Math.round(g / totalWeight),
    b: Math.round(b / totalWeight),
    a: Math.round(a / totalWeight),
  };
};

/**
 * 加权平均色采样（饱和度），计算像素块的加权平均颜色
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param startX 起始X坐标
 * @param startY 起始Y坐标
 * @param pixelSize 像素大小
 * @returns 加权平均颜色
 */
const getWeightedAverageColorBySaturation = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  let totalWeight = 0;

  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
      const pixelR = data[pixelIndex];
      const pixelG = data[pixelIndex + 1];
      const pixelB = data[pixelIndex + 2];
      const pixelA = data[pixelIndex + 3];

      // 或者使用饱和度权重
      const max = Math.max(pixelR, pixelG, pixelB);
      const min = Math.min(pixelR, pixelG, pixelB);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const weight = saturation;

      r += pixelR * weight;
      g += pixelG * weight;
      b += pixelB * weight;
      a += pixelA * weight;
      totalWeight += weight;
    }
  }

  return {
    r: Math.round(r / totalWeight),
    g: Math.round(g / totalWeight),
    b: Math.round(b / totalWeight),
    a: Math.round(a / totalWeight),
  };
};

/**
 * 中值色采样，计算像素块的中值颜色
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param startX 起始X坐标
 * @param startY 起始Y坐标
 * @param pixelSize 像素大小
 * @returns 中值颜色
 */
const getMedianColor = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  const rValues = [];
  const gValues = [];
  const bValues = [];
  const aValues = [];

  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
      rValues.push(data[pixelIndex]);
      gValues.push(data[pixelIndex + 1]);
      bValues.push(data[pixelIndex + 2]);
      aValues.push(data[pixelIndex + 3]);
    }
  }

  // 排序并取中位数
  const getMedian = (arr: number[]) => {
    arr.sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 === 0
      ? Math.round((arr[mid - 1] + arr[mid]) / 2)
      : arr[mid];
  };

  return {
    r: getMedian(rValues),
    g: getMedian(gValues),
    b: getMedian(bValues),
    a: getMedian(aValues),
  };
};

const ALT_COLOR_RATIO_MIN = 0.35;
const ALT_COLOR_DISTANCE_MIN = 50;

const colorDistance = (c1: Color, c2: Color) => {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const getContrastAwareDominantColor = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  pixelSize: number
) => {
  const colorMap = new Map<string, { color: Color; count: number }>();
  for (let y = 0; y < pixelSize && startY + y < height; y++) {
    for (let x = 0; x < pixelSize && startX + x < width; x++) {
      const i = ((startY + y) * width + (startX + x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const qr = Math.round(r / 16) * 16;
      const qg = Math.round(g / 16) * 16;
      const qb = Math.round(b / 16) * 16;
      const key = `${qr},${qg},${qb}`;
      const cur = colorMap.get(key);
      if (cur) {
        cur.count++;
      } else {
        colorMap.set(key, { color: { r: qr, g: qg, b: qb, a }, count: 1 });
      }
    }
  }

  let dominantColor = { r: 0, g: 0, b: 0, a: 255 };
  let maxCount = 0;
  for (const { color, count } of colorMap.values()) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  }

  const totalCount = Array.from(colorMap.values()).reduce(
    (s, v) => s + v.count,
    0
  );

  let bestAlt: Color | null = null;
  let bestScore = -Infinity;

  for (const { color, count } of colorMap.values()) {
    if (
      color.r === dominantColor.r &&
      color.g === dominantColor.g &&
      color.b === dominantColor.b
    ) {
      continue;
    }
    const ratio = count / totalCount;
    if (ratio < ALT_COLOR_RATIO_MIN) continue;
    const contrast = colorDistance(color, dominantColor);
    if (contrast < ALT_COLOR_DISTANCE_MIN) continue;
    const score = contrast * ratio;
    if (score > bestScore) {
      bestScore = score;
      bestAlt = color;
    }
  }

  if (bestAlt) {
    dominantColor = bestAlt;
  }

  return dominantColor;
};

/**
 * 像素采样算法Map
 */
export const pixelAlgorithms = {
  average: getAverageColor,
  median: getMedianColor,
  dominant: getDominantColor,
  weightedByLuminance: getWeightedAverageColorByLuminance,
  weightedBySaturation: getWeightedAverageColorBySaturation,
  contrastAwareDominant: getContrastAwareDominantColor,
};

/**
 * 获取像素采样算法
 * @param algorithm 算法名称
 * @returns 像素采样算法函数
 */
export const getPixelAlgorithm = (algorithm: string) => {
  return (
    pixelAlgorithms[algorithm as keyof typeof pixelAlgorithms] ||
    getAverageColor
  );
};

/**
 * 像素采样算法选项，适配i18n
 * @param t 翻译函数 const { t } = useTranslation("creator");
 * @returns 像素采样算法选项数组
 */
export const getPixelAlgorithmsOptions = (t: (key: string) => string) => [
  {
    label: t("algorithms.contrastAwareDominant"),
    value: "contrastAwareDominant",
  },
  { label: t("algorithms.dominant"), value: "dominant" },
  { label: t("algorithms.average"), value: "average" },
  { label: t("algorithms.median"), value: "median" },
  {
    label: t("algorithms.weightedByLuminance"),
    value: "weightedByLuminance",
  },
  {
    label: t("algorithms.weightedBySaturation"),
    value: "weightedBySaturation",
  },
];
