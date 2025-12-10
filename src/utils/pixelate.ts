import { getPixelAlgorithm } from './algorithm';
import { findClosestColor, getPaletteById } from './palettes';

/**
 * 像素化图像
 * @param data 图像数据
 * @param width 图像宽度
 * @param height 图像高度
 * @param pixelSize 像素块大小
 * @param pixelAlgorithm 像素化算法
 * @param paletteName 色板名称
 * @returns 像素化后的图像数据
 */
export const pixelateImage = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  pixelSize: number,
  pixelAlgorithm: string,
  paletteName: string
) => {
  // 创建新的数据数组
  const newData = new Uint8ClampedArray(data.length);

  // 遍历每个像素块
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // 计算当前像素块的合适颜色
      let pixelColor = getPixelAlgorithm(pixelAlgorithm)(
        data,
        width,
        height,
        x,
        y,
        pixelSize
      );
      // 如果选择了色板，将颜色映射到最相近的色板颜色
      pixelColor = {
        ...findClosestColor(pixelColor, getPaletteById(paletteName).colors),
        a: pixelColor.a,
      };

      // 将平均颜色应用到整个像素块
      for (
        let blockY = 0;
        blockY < pixelSize && y + blockY < height;
        blockY++
      ) {
        for (
          let blockX = 0;
          blockX < pixelSize && x + blockX < width;
          blockX++
        ) {
          const pixelIndex = ((y + blockY) * width + (x + blockX)) * 4;
          newData[pixelIndex] = pixelColor.r;
          newData[pixelIndex + 1] = pixelColor.g;
          newData[pixelIndex + 2] = pixelColor.b;
          newData[pixelIndex + 3] = pixelColor.a;
        }
      }
    }
  }

  return newData;
};
