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
  return (
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
  );
};

export default Home;
