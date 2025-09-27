import SEO from "@/components/SEO";
import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "./index.module.less";
import ControlPanel from "./screen/ControlPanel";
import PreviewPanel from "./screen/PreviewPanel";

const Creator: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pixelatedImage, setPixelatedImage] = useState<string>("");

  return (
    <>
      <SEO
        title="Pixel Artist - 在线像素艺术创作工具 | 创作页面"
        description="Pixel Artist是一款强大的在线像素艺术创作工具，通过图片转换，让您轻松创建精美的像素艺术作品"
      />
      <div className={styles.container}>
        <Row gutter={36}>
          <Col
            span={10}
            className={styles.left}
          >
            <ControlPanel
              setOriginalFile={setOriginalFile}
              setPixelatedImage={setPixelatedImage}
            />
          </Col>
          <Col span={14}>
            <PreviewPanel
              originalFile={originalFile}
              pixelatedImage={pixelatedImage}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Creator;
