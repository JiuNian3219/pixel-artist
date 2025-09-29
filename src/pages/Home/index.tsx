import SEO from "@/components/SEO";
import { Button, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate("/creator");
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: import.meta.env.VITE_SITE_URL,
    name: "Pixel Artist",
  };

  return (
    <>
      <SEO
        title="Pixel Artist - 像素艺术创作工具"
        description="使用Pixel Artist将您的图片转换为有质感的像素艺术作品，简单易用的在线像素画创作工具。"
        keywords="像素画,像素艺术,像素编辑器,在线像素画,像素创作"
        siteName="Pixel Artist"
        ogImage={`${import.meta.env.VITE_SITE_URL}/home-page.jpg`}
        jsonLd={jsonLd}
      />
      <div className={styles.container}>
        <div className={styles.card}>
          <div>
            <Title className={styles.title}>
              把你的图片，变成有<span>"质感"</span>的像素画
            </Title>
          </div>

          <Button
            color="primary"
            variant="outlined"
            size="large"
            onClick={handleStartClick}
            className={styles.startButton}
          >
            开始创作→
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
