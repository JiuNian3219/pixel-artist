// 引入状态和副作用
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import {
  DownloadOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Image, Row, Space } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
          {!isMobile && (
            <Button
              onClick={toggleExtendMode}
              style={{
                fontSize: "20px",
              }}
              icon={
                extendMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />
              }
            ></Button>
          )}
        </Flex>
      }
      className={styles.previewCard}
    >
      <div className={styles.preview}>
        {pixelatedImage ? (
          <Image
            className={styles.previewImage}
            src={pixelatedImage}
            fallback=""
            style={{ height: previewHeight }}
          />
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
            title={t("preview_panel.title")}
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
