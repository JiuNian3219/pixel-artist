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

// Tags 颜色序列
export const TAG_COLORS = [
  "rgba(255, 99, 71, 0.8)",
  "rgba(255, 165, 0, 0.8)",
  "rgba(0, 128, 0, 0.8)",
  "rgba(0, 0, 255, 0.8)",
  "rgba(128, 0, 128, 0.8)",
];
