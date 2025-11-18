import { useCreatorLocalStore } from "@/stores";
import { useEffect, useRef } from "react";
import styles from "./index.module.less";

interface PixelGridProps {
  imageWidth: number;
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
  visible: boolean;
}

const PixelGrid: React.FC<PixelGridProps> = ({
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight,
  visible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelSize = useCreatorLocalStore((state) => state.pixelSize);

  useEffect(() => {
    if (!visible || !canvasRef.current || !imageWidth || !imageHeight) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // 计算图片在容器中的实际显示尺寸和位置（object-fit: contain 的效果）
    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let displayWidth, displayHeight, offsetX, offsetY;

    if (imageAspectRatio > containerAspectRatio) {
      // 图片更宽，以宽度为准
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspectRatio;
      offsetX = 0;
      offsetY = (containerHeight - displayHeight) / 2;
    } else {
      // 图片更高，以高度为准
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspectRatio;
      offsetX = (containerWidth - displayWidth) / 2;
      offsetY = 0;
    }

    // 计算缩放比例（图片像素 -> 画布坐标）
    const scaleX = displayWidth / imageWidth;
    const scaleY = displayHeight / imageHeight;

    // 每个像素格在画布上的步长
    const stepX = pixelSize * scaleX;
    const stepY = pixelSize * scaleY;
    if (stepX <= 0 || stepY <= 0) return;

    // 设置网格样式
    ctx.strokeStyle = "rgba(105, 90, 90, 0.6)";
    ctx.lineWidth = 1;

    // 垂直线
    {
      const k0 = Math.ceil((0 - offsetX) / stepX);
      let xPos = offsetX + k0 * stepX;
      for (; xPos <= containerWidth; xPos += stepX) {
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, containerHeight);
        ctx.stroke();
      }
    }

    // 水平线
    {
      const k0y = Math.ceil((0 - offsetY) / stepY);
      let yPos = offsetY + k0y * stepY;
      for (; yPos <= containerHeight; yPos += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(containerWidth, yPos);
        ctx.stroke();
      }
    }
  }, [
    visible,
    pixelSize,
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={styles.pixelGrid}
    />
  );
};

export default PixelGrid;
