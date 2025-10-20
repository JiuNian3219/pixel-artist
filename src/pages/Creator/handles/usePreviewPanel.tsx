import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import { MAX_PREVIEW_HEIGHT, MIN_PREVIEW_HEIGHT } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UsePreviewPanelProps {
  pixelatedImage: string;
  originalFile: File | null;
}

const usePreviewPanel = ({
  pixelatedImage,
  originalFile,
}: UsePreviewPanelProps) => {
  const { t } = useTranslation("creator");
  const isMobile = useIsMobile();
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const setExtendMode = useCreatorLocalStore((state) => state.setExtendMode);
  const showPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.showPreviewPixelGrid
  );
  const setShowPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.setShowPreviewPixelGrid
  );
  const handleSaveImage = () => {
    if (!pixelatedImage || !originalFile) return;
    const link = document.createElement("a");
    link.download = originalFile.name;
    link.href = pixelatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExtendMode = () => {
    setExtendMode(!extendMode);
  };

  const [previewHeight, setPreviewHeight] = useState<number>(350);
  const [imageNaturalSize, setImageNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = previewHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const next = Math.max(
        MIN_PREVIEW_HEIGHT,
        Math.min(MAX_PREVIEW_HEIGHT, startHeight + delta)
      );
      setPreviewHeight(next);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const togglePixelGrid = () => {
    setShowPreviewPixelGrid(!showPreviewPixelGrid);
  };

  // 监听容器尺寸变化
  useEffect(() => {
    if (!previewRef.current) return;

    const updateContainerSize = () => {
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [previewHeight]);

  // 获取图片原始尺寸
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handlePreviewWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.shiftKey) return;
    const delta = e.deltaY > 0 ? -30 : 30;
    setPreviewHeight((h) =>
      Math.max(MIN_PREVIEW_HEIGHT, Math.min(MAX_PREVIEW_HEIGHT, h + delta))
    );
  };

  return {
    t,
    showPreviewPixelGrid,
    isMobile,
    extendMode,
    previewRef,
    previewHeight,
    imageNaturalSize,
    containerSize,
    togglePixelGrid,
    handleImageLoad,
    toggleExtendMode,
    handleResizerMouseDown,
    handlePreviewWheel,
    handleSaveImage,
  };
};

export default usePreviewPanel;
