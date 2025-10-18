import {
  BorderOutlined,
  DownloadOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Image, Row, Space } from "antd";
import PixelGrid from "../components/PixelGrid";
import usePreviewPanel from "../handles/usePreviewPanel";
import styles from "../index.module.less";

interface PreviewPanelProps {
  originalFile: File | null;
  pixelatedImage: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  originalFile,
  pixelatedImage,
}) => {
  const {
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
    handleSaveImage,
  } = usePreviewPanel({
    pixelatedImage,
    originalFile,
  });
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
