import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import { MAX_PREVIEW_HEIGHT, MIN_PREVIEW_HEIGHT } from "@/utils/constants";
import {
  BorderOutlined,
  DownloadOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Image, Row, Space } from "antd";
import { useRef, useState } from "react";
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
                title={t("common.show_pixel_grid")}
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showPreviewPixelGrid ? "primary" : "default"}
                size="small"
              />
            )}
            {!isMobile && (
              <Button
                title={t("common.extend_mode")}
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
        onWheel={handlePreviewWheel}
      >
        {pixelatedImage ? (
          <PixelGrid
            imageWidth={imageNaturalSize.width}
            imageHeight={imageNaturalSize.height}
            visible={showPreviewPixelGrid}
          >
            <Image
              className={styles.previewImage}
              src={pixelatedImage}
              fallback=""
              style={{ height: previewHeight }}
              onLoad={handleImageLoad}
            />
          </PixelGrid>
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
            title={t("common.save_image")}
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
            title={t("common.save_image")}
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
