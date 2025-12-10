import { useCreatorLocalStore } from '@/stores';
import {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './index.module.less';

interface PixelGridProps {
  imageWidth: number;
  imageHeight: number;
  visible: boolean;
  children?: React.ReactNode;
  gridColor?: string;
  lineWidth?: number;
}

const PixelGrid: React.FC<PixelGridProps> = ({
  imageWidth,
  imageHeight,
  visible,
  children,
  gridColor = 'rgba(105, 90, 90, 0.6)',
  lineWidth = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pixelSize = useCreatorLocalStore((state) => state.pixelSize);
  // 使用延迟值降低快速滑动时的重绘频率
  const deferredPixelSize = useDeferredValue(pixelSize);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.unobserve(wrapper);
    };
  }, []);

  useEffect(() => {
    const { width: containerWidth, height: containerHeight } = containerSize;
    if (
      !visible ||
      !canvasRef.current ||
      !imageWidth ||
      !imageHeight ||
      !containerWidth ||
      !containerHeight
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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
    const stepX = deferredPixelSize * scaleX;
    const stepY = deferredPixelSize * scaleY;
    if (stepX <= 0 || stepY <= 0) return;

    // 设置网格样式
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = lineWidth;

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
    deferredPixelSize,
    imageWidth,
    imageHeight,
    containerSize,
    gridColor,
    lineWidth,
  ]);

  return (
    <div ref={wrapperRef} className={styles.pixelGridWrapper}>
      {children}
      {visible && <canvas ref={canvasRef} className={styles.pixelGrid} />}
    </div>
  );
};

export default PixelGrid;
