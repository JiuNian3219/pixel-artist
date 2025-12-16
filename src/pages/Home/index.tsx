import previewScenery from '@/assets/preview-scenery.jpg';
import pixelPreviewScenery from '@/assets/preview-scenery.pixel.png';
import CompareSlider from '@/components/CompareSlider';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePageContext } from '@/renderer/usePageContext';
import { parseLocaleFromPath, withLocalePath } from '@/utils/locale';
import { Button, Col, Flex, Row, Typography } from 'antd';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { navigate } from 'vike/client/router';
import styles from './index.module.less';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const pageContext = usePageContext();
  const locale = parseLocaleFromPath(pageContext.urlPathname);
  const isMobile = useIsMobile();
  const { t } = useTranslation('home');

  const handleStartClick = () => {
    navigate(withLocalePath(locale, '/creator'));
  };

  const handleEditorClick = () => {
    navigate(withLocalePath(locale, '/editor'));
  };

  return (
    <Row justify="center" align="middle" className={styles.container}>
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
      <Col span={isMobile ? 24 : 12} className={styles.imagePreview}>
        <CompareSlider
          leftSrc={pixelPreviewScenery}
          rightSrc={previewScenery}
          alt="pixel-artist"
        />
      </Col>
      <Col span={isMobile ? 24 : 12} className={styles.content}>
        <Flex vertical align="center" gap={80}>
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
          <Flex
            gap={isMobile ? 32 : 48}
            vertical={isMobile}
            align={isMobile ? 'center' : 'start'}
          >
            <Flex
              vertical
              align="center"
              gap={16}
              className={styles.actionItem}
            >
              <Button
                title={t('start_button')}
                color="primary"
                variant="outlined"
                size="large"
                onClick={handleStartClick}
                className={styles.startButton}
              >
                {t('start_button')}
              </Button>
              <Text className={styles.description}>
                {t('start_button_desc')}
              </Text>
            </Flex>

            <Flex
              vertical
              align="center"
              gap={16}
              className={styles.actionItem}
            >
              <Button
                title={t('start_editor_button')}
                variant="outlined"
                size="large"
                color="primary"
                onClick={handleEditorClick}
                className={styles.startButton}
              >
                {t('start_editor_button')}
              </Button>
              <Text className={styles.description}>
                {t('start_editor_button_desc')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};

export default Home;
