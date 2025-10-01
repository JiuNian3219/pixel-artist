import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "./index.module.less";
import ControlPanel from "./screen/ControlPanel";
import PreviewPanel from "./screen/PreviewPanel";

const Creator: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pixelatedImage, setPixelatedImage] = useState<string>("");

  return (
    <div className={styles.container}>
      <Row
        gutter={36}
        className={styles.creatorRow}
      >
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={10}
          xl={10}
          className={styles.left}
        >
          <ControlPanel
            setOriginalFile={setOriginalFile}
            setPixelatedImage={setPixelatedImage}
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={14}
        >
          <PreviewPanel
            originalFile={originalFile}
            pixelatedImage={pixelatedImage}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Creator;
