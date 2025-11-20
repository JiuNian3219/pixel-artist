import previewScenery from "@/assets/preview-scenery.jpg";
import pixelPreviewScenery from "@/assets/preview-scenery.pixel.png";
import CompareSlider from "@/components/CompareSlider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { parseLocaleFromPath, withLocalePath } from "@/utils/locale";
import { Button, Col, Flex, Row, Typography } from "antd";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const locale = parseLocaleFromPath(window.location.pathname);
  const isMobile = useIsMobile();
  const { t } = useTranslation("home");
  const handleStartClick = () => {
    navigate(withLocalePath(locale, "/creator"));
  };

  return (
    <Row
      justify="center"
      align="middle"
      className={styles.container}
    >
      {isMobile && (
        <Col>
          <Title className={styles.title}>
            <Trans
              i18nKey="title"
              ns="home"
              components={{
                1: <span />,
              }}
            />
          </Title>
        </Col>
      )}
      <Col
        span={isMobile ? 24 : 12}
        className={styles.imagePreview}
      >
        <CompareSlider
          leftSrc={pixelPreviewScenery}
          rightSrc={previewScenery}
          alt="pixel-artist"
        />
      </Col>
      <Col
        span={isMobile ? 24 : 12}
        className={styles.content}
      >
        <Flex
          vertical
          align="center"
          gap={80}
        >
          {!isMobile && (
            <Title className={styles.title}>
              <Trans
                i18nKey="title"
                ns="home"
                components={{
                  1: <span />,
                }}
              />
            </Title>
          )}
          <Button
            title={t("start_button")}
            color="primary"
            variant="outlined"
            size="large"
            onClick={handleStartClick}
            className={styles.startButton}
          >
            {t("start_button")}
          </Button>
        </Flex>
      </Col>
    </Row>
  );
};

export default Home;
