import { Button, Typography } from "antd";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { parseLocaleFromPath, withLocalePath } from "@/utils/locale";
import styles from "./index.module.less";

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const locale = parseLocaleFromPath(window.location.pathname);
  const { t } = useTranslation("home");
  const handleStartClick = () => {
    navigate(withLocalePath(locale, "/creator"));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <Title className={styles.title}>
            <Trans
              i18nKey="title"
              ns="home"
              components={{
                1: <span />,
              }}
            />
          </Title>
        </div>

        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={handleStartClick}
          className={styles.startButton}
        >
          {t("start_button")}
        </Button>
      </div>
    </div>
  );
};

export default Home;
