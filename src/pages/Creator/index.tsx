import SEO from "@/components/SEO";
import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "./index.module.less";
import ControlPanel from "./screen/ControlPanel";
import PreviewPanel from "./screen/PreviewPanel";

const Creator: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pixelatedImage, setPixelatedImage] = useState<string>("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${import.meta.env.VITE_SITE_URL}/creator`,
    name: "Pixel Artist - 创作页面",
  };

  return (
    <>
      <SEO
        title="Pixel Artist - 在线像素艺术创作工具 | 创作页面"
        description="Pixel Artist是一款强大的在线像素艺术创作工具，通过图片转换，让您轻松创建精美的像素艺术作品"
        keywords="像素艺术, 在线像素画, 像素画创作, 像素画转换, 像素画工具"
        siteName="Pixel Artist"
        ogImage={`${import.meta.env.VITE_SITE_URL}/creator-page.jpg`}
        jsonLd={jsonLd}
      />
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
    </>
  );
};

export default Creator;
