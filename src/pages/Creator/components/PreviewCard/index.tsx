import { MAX_PREVIEW_HEIGHT, MIN_PREVIEW_HEIGHT } from "@/utils/constants";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Image, Row, Tag } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PixelGrid from "../PixelGrid";
import styles from "./index.module.less";

// Tags 颜色序列
const TAG_COLORS = [
  "rgba(255, 99, 71, 0.8)",
  "rgba(255, 165, 0, 0.8)",
  "rgba(0, 128, 0, 0.8)",
  "rgba(0, 0, 255, 0.8)",
  "rgba(128, 0, 128, 0.8)",
];

interface PreviewCardProps {
  originalFile: File | null;
  pixelatedImage: string;
  defaultPreviewHeight?: number;
  showPixelGrid: boolean;
  showSaveButton?: boolean;
  saveButtonPlacement?: "top" | "bottom";
  showResizeHandle?: boolean;
  tags?: string[];
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  originalFile,
  pixelatedImage,
  defaultPreviewHeight = 350,
  showPixelGrid,
  showSaveButton = true,
  saveButtonPlacement = "top",
  showResizeHandle = false,
  tags = [],
}) => {
  const { t } = useTranslation("creator");
  const [previewHeight, setPreviewHeight] =
    useState<number>(defaultPreviewHeight);
  const [imageNaturalSize, setImageNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleSaveImage = () => {
    if (!pixelatedImage || !originalFile) return;
    const link = document.createElement("a");
    link.download = originalFile.name;
    link.href = pixelatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handlePreviewWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.shiftKey) return;
    const delta = e.deltaY > 0 ? -30 : 30;
    setPreviewHeight((h) =>
      Math.max(MIN_PREVIEW_HEIGHT, Math.min(MAX_PREVIEW_HEIGHT, h + delta))
    );
  };

  // 获取图片原始尺寸
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  return (
    <>
      <div
        className={styles.previewCard}
        onWheel={handlePreviewWheel}
      >
        {pixelatedImage ? (
          <PixelGrid
            imageWidth={imageNaturalSize.width}
            imageHeight={imageNaturalSize.height}
            visible={showPixelGrid}
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
        {showResizeHandle && (
          <div
            className={styles.previewResizeHandle}
            onMouseDown={handleResizerMouseDown}
          />
        )}

        {showSaveButton && saveButtonPlacement === "top" && (
          <Button
            title={t("common.save_image")}
            className={styles.topSaveButton}
            icon={<DownloadOutlined />}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          ></Button>
        )}
        {/* Tags 标签 */}
        {tags?.length > 0 && (
          <div className={styles.tagsGroup}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                color={TAG_COLORS[index % TAG_COLORS.length]}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
      {showSaveButton && saveButtonPlacement === "bottom" && (
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
    </>
  );
};

export default PreviewCard;
