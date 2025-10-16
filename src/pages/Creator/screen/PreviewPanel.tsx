import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import {
  BorderOutlined,
  DownloadOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Image, Row, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PixelGrid from "../components/PixelGrid";
import styles from "../index.module.less";

interface PreviewPanelProps {
  originalFile: File | null;
  pixelatedImage: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  originalFile,
  pixelatedImage,
}) => {
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
    const minHeight = 250;
    const maxHeight = 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const next = Math.max(
        minHeight,
        Math.min(maxHeight, startHeight + delta)
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

  return (
    <Card
      title={
        <Flex
          justify="space-between"
          align="center"
        >
          <Space>
            <EyeOutlined />
            {t("preview_panel.title")}
          </Space>
          <Space>
            {/* 网格显示切换按钮 */}
            {pixelatedImage && (
              <Button
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showPreviewPixelGrid ? "primary" : "default"}
                size="small"
              />
            )}
            {!isMobile && (
              <Button
                onClick={toggleExtendMode}
                style={{
                  fontSize: "20px",
                }}
                icon={
                  extendMode ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
              ></Button>
            )}
          </Space>
        </Flex>
      }
      className={styles.previewCard}
    >
      <div
        className={styles.preview}
        ref={previewRef}
      >
        {pixelatedImage ? (
          <>
            <Image
              className={styles.previewImage}
              src={pixelatedImage}
              fallback=""
              style={{ height: previewHeight }}
              onLoad={handleImageLoad}
            />
            {/* 网格覆盖层 */}
            <PixelGrid
              imageWidth={imageNaturalSize.width}
              imageHeight={imageNaturalSize.height}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
              visible={showPreviewPixelGrid}
            />
          </>
        ) : (
          <div className={styles.emptyPreview}>
            {originalFile
              ? t("preview_panel.upload_after_hint")
              : t("preview_panel.upload_hint")}
          </div>
        )}

        {/* 底部高度调节句柄 */}
        {!isMobile && (
          <div
            className={styles.previewResizeHandle}
            onMouseDown={handleResizerMouseDown}
          />
        )}

        {!isMobile && (
          <Button
            className={styles.topSaveButton}
            icon={<DownloadOutlined />}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          ></Button>
        )}
      </div>

      {/** 保存按钮（仅移动端显示） */}
      {isMobile && (
        <Row className={styles.actionRow}>
          <Button
            type="primary"
            className={styles.saveButton}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          >
            {t("preview_panel.save_button")}
          </Button>
        </Row>
      )}
    </Card>
  );
};

export default PreviewPanel;
