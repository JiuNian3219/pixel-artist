export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
}

// 16位机色板
const sixteenBitPalette: Palette = {
  id: "16-Bit",
  name: "16-Bit 16色",
  colors: [
    // 黑色
    { r: 0, g: 0, b: 0 },
    // 深蓝
    { r: 29, g: 43, b: 83 },
    // 深紫
    { r: 126, g: 37, b: 83 },
    // 深绿
    { r: 0, g: 135, b: 81 },
    // 棕色
    { r: 171, g: 82, b: 54 },
    // 深灰
    { r: 95, g: 87, b: 79 },
    // 浅灰
    { r: 194, g: 195, b: 199 },
    // 白色
    { r: 255, g: 241, b: 232 },
    // 红色
    { r: 255, g: 0, b: 77 },
    // 橙色
    { r: 255, g: 163, b: 0 },
    // 黄色
    { r: 255, g: 236, b: 39 },
    // 绿色
    { r: 0, g: 228, b: 54 },
    // 蓝色
    { r: 41, g: 173, b: 255 },
    // 靛色
    { r: 131, g: 118, b: 156 },
    // 粉色
    { r: 255, g: 119, b: 168 },
    // 桃色
    { r: 255, g: 109, b: 168 },
  ],
};

// DawnBringer's 16色板
const dawnBringer16Palette: Palette = {
  id: "DawnBringer-16",
  name: "DawnBringer 16色",
  colors: [
    // 深紫黑
    { r: 20, g: 12, b: 28 },
    // 深紫红
    { r: 68, g: 36, b: 52 },
    // 深蓝
    { r: 48, g: 52, b: 109 },
    // 深灰
    { r: 78, g: 74, b: 78 },
    // 棕色
    { r: 133, g: 76, b: 48 },
    // 深绿
    { r: 52, g: 101, b: 36 },
    // 红色
    { r: 208, g: 70, b: 72 },
    // 米色
    { r: 117, g: 113, b: 97 },
    // 蓝色
    { r: 89, g: 125, b: 206 },
    // 橙色
    { r: 210, g: 125, b: 44 },
    // 浅灰
    { r: 133, g: 149, b: 161 },
    // 绿色
    { r: 109, g: 170, b: 44 },
    // 浅桃
    { r: 210, g: 170, b: 153 },
    // 青色
    { r: 109, g: 194, b: 202 },
    // 黄色
    { r: 218, g: 212, b: 94 },
    // 淡绿白
    { r: 222, g: 238, b: 214 },
  ],
};

// DawnBringer's 32色板
const dawnBringer32Palette: Palette = {
  id: "DawnBringer-32",
  name: "DawnBringer 32色",
  colors: [
    // 黑色
    { r: 0, g: 0, b: 0 },
    // 深蓝黑
    { r: 34, g: 32, b: 52 },
    // 深紫
    { r: 69, g: 40, b: 60 },
    // 深棕
    { r: 102, g: 57, b: 49 },
    // 棕色
    { r: 143, g: 86, b: 59 },
    // 橙色
    { r: 223, g: 113, b: 38 },
    // 浅橙
    { r: 217, g: 160, b: 102 },
    // 米色
    { r: 238, g: 195, b: 154 },
    // 黄色
    { r: 251, g: 242, b: 54 },
    // 亮绿
    { r: 153, g: 229, b: 80 },
    // 绿色
    { r: 106, g: 190, b: 48 },
    // 深绿
    { r: 55, g: 148, b: 110 },
    // 橄榄绿
    { r: 75, g: 105, b: 47 },
    // 深橄榄
    { r: 82, g: 75, b: 36 },
    // 深灰绿
    { r: 50, g: 60, b: 57 },
    // 深蓝
    { r: 63, g: 63, b: 116 },
    // 蓝色
    { r: 48, g: 96, b: 130 },
    // 亮蓝
    { r: 91, g: 110, b: 225 },
    // 天蓝
    { r: 99, g: 155, b: 255 },
    // 青色
    { r: 95, g: 205, b: 228 },
    // 淡蓝
    { r: 203, g: 219, b: 252 },
    // 白色
    { r: 255, g: 255, b: 255 },
    // 浅灰
    { r: 155, g: 173, b: 183 },
    // 中灰
    { r: 105, g: 106, b: 106 },
    // 深灰
    { r: 89, g: 86, b: 82 },
    // 紫色
    { r: 118, g: 66, b: 138 },
    // 深红
    { r: 172, g: 50, b: 50 },
    // 红色
    { r: 217, g: 87, b: 99 },
    // 粉色
    { r: 215, g: 123, b: 186 },
    // 橄榄
    { r: 143, g: 151, b: 74 },
    // 土黄
    { r: 138, g: 111, b: 48 },
    // 深紫红
    { r: 92, g: 55, b: 70 },
  ],
};

// PICO-8色板
const pico8Palette: Palette = {
  id: "Pico-8",
  name: "PICO-8 16色",
  colors: [
    // 黑色
    { r: 0, g: 0, b: 0 },
    // 深蓝
    { r: 29, g: 43, b: 83 },
    // 深紫
    { r: 126, g: 37, b: 83 },
    // 深绿
    { r: 0, g: 135, b: 81 },
    // 棕色
    { r: 171, g: 82, b: 54 },
    // 深灰
    { r: 95, g: 87, b: 79 },
    // 浅灰
    { r: 194, g: 195, b: 199 },
    // 白色
    { r: 255, g: 241, b: 232 },
    // 红色
    { r: 255, g: 0, b: 77 },
    // 橙色
    { r: 255, g: 163, b: 0 },
    // 黄色
    { r: 255, g: 236, b: 39 },
    // 绿色
    { r: 0, g: 228, b: 54 },
    // 蓝色
    { r: 41, g: 173, b: 255 },
    // 靛色
    { r: 131, g: 118, b: 156 },
    // 粉色
    { r: 255, g: 119, b: 168 },
    // 桃色
    { r: 255, g: 109, b: 168 },
  ],
};

// Arne’s 16 色板
const arne16Palette: Palette = {
  id: "Arne-16",
  name: "Arne 16色",
  colors: [
    // 黑色
    { r: 0, g: 0, b: 0 },
    // 深褐
    { r: 73, g: 60, b: 43 },
    // 绯红
    { r: 190, g: 38, b: 51 },
    // 玫瑰粉
    { r: 224, g: 111, b: 139 },
    // 中灰
    { r: 157, g: 157, b: 157 },
    // 赤褐
    { r: 164, g: 100, b: 34 },
    // 橙色
    { r: 235, g: 137, b: 49 },
    // 明黄
    { r: 247, g: 226, b: 107 },
    // 白色
    { r: 255, g: 255, b: 255 },
    // 夜蓝
    { r: 27, g: 38, b: 50 },
    // 青灰
    { r: 47, g: 72, b: 78 },
    // 苔绿
    { r: 68, g: 137, b: 26 },
    // 黄绿
    { r: 163, g: 206, b: 39 },
    // 深青蓝
    { r: 0, g: 87, b: 132 },
    // 天蓝
    { r: 49, g: 162, b: 242 },
    // 冰蓝
    { r: 178, g: 220, b: 239 },
  ],
};

// NES（红白机）的54色调色板
const nesPalette: Palette = {
  id: "NES-54",
  name: "NES 54色",
  colors: [
    // 白色
    { r: 255, g: 255, b: 255 },
    // 浅灰
    { r: 173, g: 173, b: 173 },
    // 深灰
    { r: 99, g: 99, b: 99 },
    // 黑色
    { r: 0, g: 0, b: 0 },
    // 淡天蓝
    { r: 189, g: 222, b: 255 },
    // 亮蓝
    { r: 99, g: 173, b: 255 },
    // 中蓝
    { r: 25, g: 99, b: 214 },
    // 深蓝
    { r: 0, g: 41, b: 140 },
    // 冰蓝紫
    { r: 214, g: 214, b: 255 },
    // 长春花蓝
    { r: 148, g: 148, b: 255 },
    // 电蓝紫
    { r: 66, g: 66, b: 255 },
    // 深靛蓝
    { r: 16, g: 16, b: 165 },
    // 淡紫
    { r: 230, g: 197, b: 255 },
    // 洋紫
    { r: 197, g: 115, b: 255 },
    // 紫蓝
    { r: 115, g: 41, b: 255 },
    // 深紫
    { r: 58, g: 0, b: 165 },
    // 浅粉紫
    { r: 247, g: 197, b: 255 },
    // 亮品红
    { r: 239, g: 107, b: 255 },
    // 深洋红紫
    { r: 156, g: 25, b: 206 },
    // 深紫罗兰
    { r: 90, g: 0, b: 123 },
    // 淡粉
    { r: 255, g: 197, b: 230 },
    // 亮粉
    { r: 255, g: 107, b: 206 },
    // 洋红
    { r: 181, g: 33, b: 123 },
    // 酒红
    { r: 107, g: 0, b: 66 },
    // 浅肉色
    { r: 255, g: 206, b: 197 },
    // 珊瑚橙粉
    { r: 255, g: 132, b: 115 },
    // 砖红
    { r: 181, g: 49, b: 33 },
    // 深棕红
    { r: 107, g: 8, b: 0 },
    // 浅卡其
    { r: 247, g: 214, b: 165 },
    // 金橙
    { r: 230, g: 156, b: 33 },
    // 焦橙/赭
    { r: 156, g: 74, b: 0 },
    // 深赭棕
    { r: 82, g: 33, b: 0 },
    // 柠檬黄绿
    { r: 230, g: 230, b: 148 },
    // 橄榄黄
    { r: 189, g: 189, b: 0 },
    // 深橄榄
    { r: 107, g: 107, b: 0 },
    // 极深橄榄
    { r: 49, g: 49, b: 0 },
    // 嫩绿
    { r: 206, g: 239, b: 148 },
    // 亮草绿
    { r: 140, g: 214, b: 0 },
    // 深草绿
    { r: 58, g: 132, b: 0 },
    // 墨绿
    { r: 8, g: 74, b: 0 },
    // 薄荷绿
    { r: 189, g: 247, b: 173 },
    // 青柠绿
    { r: 90, g: 230, b: 49 },
    // 森林绿
    { r: 16, g: 148, b: 0 },
    // 深森林绿
    { r: 0, g: 82, b: 0 },
    // 淡水绿
    { r: 181, g: 247, b: 206 },
    // 翡翠绿
    { r: 66, g: 222, b: 132 },
    // 深青绿
    { r: 0, g: 140, b: 49 },
    // 墨青绿
    { r: 0, g: 82, b: 8 },
    // 浅青
    { r: 181, g: 239, b: 239 },
    // 湖蓝
    { r: 74, g: 206, b: 222 },
    // 深青蓝
    { r: 0, g: 123, b: 140 },
    // 墨青蓝
    { r: 0, g: 66, b: 74 },
    // 中灰
    { r: 181, g: 181, b: 181 },
    // urther灰
    { r: 82, g: 82, b: 82 },
  ],
};

// 全色色板
const allColorsPalette: Palette = {
  id: "All-Colors",
  name: "全色色板",
  colors: [],
};

/**
 * 色板列表
 */
export const palettes = [
  allColorsPalette,
  sixteenBitPalette,
  dawnBringer16Palette,
  dawnBringer32Palette,
  pico8Palette,
  arne16Palette,
  nesPalette,
] as const;

/**
 * 色板列索引表，以 palette.id 为 key
 */
export const palettesById: Record<string, Palette> = palettes.reduce(
  (acc, palette) => {
    acc[palette.id] = palette;
    return acc;
  },
  {} as Record<string, Palette>
);
/**
 * RGB 转 XYZ 色彩空间
 */
const rgbToXyz = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  // 归一化到 0-1
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  // 应用 gamma 校正
  rNorm =
    rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm =
    gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm =
    bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

  // 转换到 XYZ (使用 D65 标准光源)
  const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
  const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.072175;
  const z = rNorm * 0.0193339 + gNorm * 0.119192 + bNorm * 0.9503041;

  return [x * 100, y * 100, z * 100];
};
/**
 * XYZ 转 Lab 色彩空间
 */
const xyzToLab = (
  x: number,
  y: number,
  z: number
): [number, number, number] => {
  // D65 标准光源白点
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  const fx = x / xn;
  const fy = y / yn;
  const fz = z / zn;

  const delta = 6 / 29;
  const deltaSquared = delta * delta;
  const deltaCubed = delta * delta * delta;

  const fxTransformed =
    fx > deltaCubed ? Math.pow(fx, 1 / 3) : fx / (3 * deltaSquared) + 4 / 29;
  const fyTransformed =
    fy > deltaCubed ? Math.pow(fy, 1 / 3) : fy / (3 * deltaSquared) + 4 / 29;
  const fzTransformed =
    fz > deltaCubed ? Math.pow(fz, 1 / 3) : fz / (3 * deltaSquared) + 4 / 29;

  const L = 116 * fyTransformed - 16;
  const a = 500 * (fxTransformed - fyTransformed);
  const b = 200 * (fyTransformed - fzTransformed);

  return [L, a, b];
};

/**
 * RGB 转 Lab 色彩空间
 */
const rgbToLab = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
};

/**
 * 计算 CIEDE2000 距离 (ΔE00) - 完整版本
 * 基于 CIE 2000 标准，包含所有修正因子
 */
const calculateCIEDE2000Distance = (color1: Color, color2: Color): number => {
  const [L1, a1, b1] = rgbToLab(color1.r, color1.g, color1.b);
  const [L2, a2, b2] = rgbToLab(color2.r, color2.g, color2.b);

  // 步骤1: 计算色度值
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const CAvg = (C1 + C2) / 2;

  // 步骤2: 计算 G 因子
  const G =
    0.5 *
    (1 - Math.sqrt(Math.pow(CAvg, 7) / (Math.pow(CAvg, 7) + Math.pow(25, 7))));

  // 步骤3: 计算调整后的 a* 值
  const a1Prime = (1 + G) * a1;
  const a2Prime = (1 + G) * a2;

  // 步骤4: 计算调整后的色度值
  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

  // 步骤5: 计算色相角 (弧度转角度)
  const h1Prime = Math.atan2(b1, a1Prime) * (180 / Math.PI);
  const h2Prime = Math.atan2(b2, a2Prime) * (180 / Math.PI);

  // 确保色相角在 [0, 360) 范围内
  const h1PrimeNorm = h1Prime >= 0 ? h1Prime : h1Prime + 360;
  const h2PrimeNorm = h2Prime >= 0 ? h2Prime : h2Prime + 360;

  // 步骤6: 计算差值
  const deltaL = L2 - L1;
  const deltaC = C2Prime - C1Prime;

  // 计算色相差值 (考虑周期性)
  let deltaH;
  if (C1Prime * C2Prime === 0) {
    deltaH = 0;
  } else {
    const diff = h2PrimeNorm - h1PrimeNorm;
    if (Math.abs(diff) <= 180) {
      deltaH = diff;
    } else if (diff > 180) {
      deltaH = diff - 360;
    } else {
      deltaH = diff + 360;
    }
  }

  const deltaHPrime =
    2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((deltaH * Math.PI) / 360);

  // 步骤7: 计算平均值
  const LAvg = (L1 + L2) / 2;
  const CAvgPrime = (C1Prime + C2Prime) / 2;

  // 计算平均色相角
  let HAvgPrime;
  if (C1Prime * C2Prime === 0) {
    HAvgPrime = h1PrimeNorm + h2PrimeNorm;
  } else {
    const sum = h1PrimeNorm + h2PrimeNorm;
    const diff = Math.abs(h1PrimeNorm - h2PrimeNorm);
    if (diff <= 180) {
      HAvgPrime = sum / 2;
    } else if (sum < 360) {
      HAvgPrime = (sum + 360) / 2;
    } else {
      HAvgPrime = (sum - 360) / 2;
    }
  }

  // 步骤8: 计算权重函数
  const T =
    1 -
    0.17 * Math.cos(((HAvgPrime - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * HAvgPrime * Math.PI) / 180) +
    0.32 * Math.cos(((3 * HAvgPrime + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * HAvgPrime - 63) * Math.PI) / 180);

  const deltaTheta = 30 * Math.exp(-Math.pow((HAvgPrime - 275) / 25, 2));

  const RC =
    2 *
    Math.sqrt(
      Math.pow(CAvgPrime, 7) / (Math.pow(CAvgPrime, 7) + Math.pow(25, 7))
    );

  const SL =
    1 +
    (0.015 * Math.pow(LAvg - 50, 2)) / Math.sqrt(20 + Math.pow(LAvg - 50, 2));
  const SC = 1 + 0.045 * CAvgPrime;
  const SH = 1 + 0.015 * CAvgPrime * T;

  const RT = -Math.sin((2 * deltaTheta * Math.PI) / 180) * RC;

  // 步骤9: 计算最终的 CIEDE2000 距离
  const kL = 1; // 亮度权重因子
  const kC = 1; // 色度权重因子
  const kH = 1; // 色相权重因子

  const deltaE00 = Math.sqrt(
    Math.pow(deltaL / (kL * SL), 2) +
      Math.pow(deltaC / (kC * SC), 2) +
      Math.pow(deltaHPrime / (kH * SH), 2) +
      RT * (deltaC / (kC * SC)) * (deltaHPrime / (kH * SH))
  );

  return deltaE00;
};

/**
 * 查找目标颜色在色板中的最接近颜色
 * @param targetColor 目标颜色
 * @param palette 色板颜色数组
 * @returns 最接近的颜色
 */
export const findClosestColor = (
  targetColor: Color,
  palette: Color[]
): Color => {
  if (palette.length === 0) {
    return targetColor;
  }
  let closestColor = palette[0];
  let minDistance = Number.MAX_VALUE;

  for (const paletteColor of palette) {
    const distance = calculateCIEDE2000Distance(targetColor, paletteColor);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
};

/**
 * 获取指定名称的色板
 * @param name 色板名称
 * @returns
 */
export const getPaletteById = (id: string): Palette => {
  return palettesById[id] || allColorsPalette;
};

/**
 * 根据Color获取对应#FFFFFF格式的颜色字符串
 * @param color 颜色对象
 * @returns 对应的#FFFFFF格式颜色字符串
 */
export const getColorHex = (color: Color): string => {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

/**
 * 色板选项
 * @param t 翻译函数 const { t } = useTranslation("creator");
 * @returns 色板选项数组
 */
export const getPaletteOptions = (t: (key: string) => string) =>
  palettes.map((palette) => ({
    label: t(`palettes.${palette.id}`),
    value: palette.id,
  }));
