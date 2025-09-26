// 最大像素尺寸
export const MAX_PIXEL_SIZE = 64;

/**
 *  最小像素尺寸
 */
export const MIN_PIXEL_SIZE = 1;

/**
 * 判断文件是否为图片
 * @param file 文件对象
 * @returns 是否为图片
 */
export const isImageFile = (file: File): boolean => {
  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  return validImageTypes.includes(file.type || "");
};
