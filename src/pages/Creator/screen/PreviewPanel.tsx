import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Image, Row, Space } from "antd";
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
  const handleSaveImage = () => {
    if (!pixelatedImage || !originalFile) return;
    const link = document.createElement("a");
    link.download = originalFile.name;
    link.href = pixelatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      title={
        <Space>
          <EyeOutlined />
          {t("preview_panel.title")}
        </Space>
      }
      className={styles.rightCard}
    >
      <div className={styles.preview}>
        {pixelatedImage ? (
          <Image
            className={styles.previewImage}
            src={pixelatedImage}
            fallback=""
          />
        ) : (
          <div className={styles.emptyPreview}>
            {originalFile
              ? t("preview_panel.upload_after_hint")
              : t("preview_panel.upload_hint")}
          </div>
        )}
      </div>

      <Row className={styles.actionRow}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{ textAlign: "right" }}
        >
          <Button
            type="primary"
            className={styles.saveButton}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          >
            {t("preview_panel.save_button")}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PreviewPanel;
