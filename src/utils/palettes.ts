export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  name: string;
  colors: Color[];
  description: string;
}

// 16位机色板
const sixteenBitPalette: Palette = {
  name: "16-Bit 16色",
  description: "经典16位游戏机色板",
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
  name: "DawnBringer 16色",
  description: "DawnBringer's 16色经典像素艺术色板",
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
  name: "DawnBringer 32色",
  description: "DawnBringer's 32色扩展像素艺术色板",
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
  name: "PICO-8 16色",
  description: "PICO-8 游戏引擎经典16色板",
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
    { r: 255, g: 204, b: 170 },
  ],
};

// Arne’s 16 色板
const arne16Palette: Palette = {
  name: "Arne 16色",
  description: "Arne’s 16色经典像素艺术色板，偏向饱和、复古卡通感",
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
  name: "NES 54色",
  description: "NES（红白机）的54色调色板，包含16种颜色",
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
    // 更深灰
    { r: 82, g: 82, b: 82 },
  ],
};

// 全色色板
const allColorsPalette: Palette = {
  name: "全色色板",
  description: "",
  colors: [],
};

export const palettes: Palette[] = [
  allColorsPalette,
  sixteenBitPalette,
  dawnBringer16Palette,
  dawnBringer32Palette,
  pico8Palette,
  arne16Palette,
  nesPalette,
];

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

  // 使用欧几里得距离计算颜色差异
  for (const paletteColor of palette) {
    const distance = Math.sqrt(
      Math.pow(targetColor.r - paletteColor.r, 2) +
        Math.pow(targetColor.g - paletteColor.g, 2) +
        Math.pow(targetColor.b - paletteColor.b, 2)
    );

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
export const getPaletteByName = (name: string): Palette => {
  return palettes.find((palette) => palette.name === name) || allColorsPalette;
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
 */
export const paletteOptions = palettes.map((palette) => ({
  label: palette.name,
  value: palette.name,
}));
