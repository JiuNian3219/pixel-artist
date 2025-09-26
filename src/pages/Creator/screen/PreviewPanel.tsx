import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Image, Row, Space } from "antd";
import styles from "../index.module.less";

interface PreviewPanelProps {
  originalFile: File | null;
  pixelatedImage: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  originalFile,
  pixelatedImage,
}) => {
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
          预览效果
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
            {originalFile ? '点击"转换为像素画"按钮生成像素图' : "请先上传图片"}
          </div>
        )}
      </div>

      <Row className={styles.actionRow}>
        <Col
          span={24}
          style={{ textAlign: "right" }}
        >
          <Button
            type="primary"
            className={styles.saveButton}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          >
            保存到本地
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PreviewPanel;
