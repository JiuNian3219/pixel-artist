import CenterSpin from '@/components/CenterSpin';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCreatorLocalStore } from '@/stores';
import { useCreatorStore } from '@/stores/creatorStore';
import { getPixelAlgorithmsOptions } from '@/utils/algorithm';
import { PREVIEW_COLUMNS, TASK_FACTORS } from '@/utils/constants';
import { getPaletteOptions } from '@/utils/palettes';
import {
  BorderOutlined,
  ClearOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Segmented, Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PreviewCard from '../components/PreviewCard';
import styles from '../index.module.less';

interface PreviewPanelProps {
  originalFile: File | null;
  pixelatedResults?: {
    id: string;
    url: string;
    algorithm: string;
    palette: string;
    pixelSize?: number;
  }[];
  onClearResults: () => Promise<void>;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  originalFile,
  pixelatedResults = [],
  onClearResults,
}) => {
  const { t } = useTranslation('creator');
  const { t: paletteT } = useTranslation('common');
  const isMobile = useIsMobile();
  const previewColumnOptions = PREVIEW_COLUMNS.map((v) => ({
    label: t(`preview_panel.columns.${v}`),
    value: v,
  }));
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const previewColumns = useCreatorLocalStore((state) => state.previewColumns);
  const showPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.showPreviewPixelGrid
  );
  const inPixelation = useCreatorStore((state) => state.inPixelation);
  const multiAlgorithmEnabled = useCreatorLocalStore(
    (state) => state.multiAlgorithmEnabled
  );
  const defaultPreviewHeight = useCreatorLocalStore(
    (state) => state.defaultPreviewHeight
  );
  const selectedAlgorithms = useCreatorLocalStore(
    (state) => state.selectedAlgorithms
  );
  const selectedPalettes = useCreatorLocalStore(
    (state) => state.selectedPalettes
  );
  // 预览展示的列数
  const colSpan = multiAlgorithmEnabled
    ? Math.floor(24 / Math.max(1, previewColumns))
    : 24;
  const taskFactorsOrder = useCreatorLocalStore(
    (state) => state.taskFactorsOrder
  );
  const setShowPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.setShowPreviewPixelGrid
  );
  const setExtendMode = useCreatorLocalStore((state) => state.setExtendMode);
  const setPreviewColumns = useCreatorLocalStore(
    (state) => state.setPreviewColumns
  );
  const algoOptions = getPixelAlgorithmsOptions(t);
  const paletteOptions = getPaletteOptions(paletteT);
  const labelOf = (
    list: { label: React.ReactNode; value: string | number }[],
    v: string
  ) => (list.find((o) => o.value === v)?.label as string) ?? v;

  const toggleExtendMode = () => {
    setExtendMode(!extendMode);
  };

  const togglePixelGrid = () => {
    setShowPreviewPixelGrid(!showPreviewPixelGrid);
  };

  const togglePreviewColumns = (v: number) => {
    setPreviewColumns(Number(v));
  };

  const clearPreview = async () => {
    // 清除所有生成的预览图片
    await onClearResults();
  };

  useEffect(() => {
    if (isMobile) {
      setPreviewColumns(1);
    }
  }, [isMobile]);

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Space>
            <EyeOutlined />
            {t('preview_panel.title')}
          </Space>
          <Space>
            {!isMobile && multiAlgorithmEnabled && (
              <Segmented
                shape="round"
                options={previewColumnOptions}
                value={previewColumns}
                onChange={togglePreviewColumns}
              />
            )}
            {/* 网格显示切换按钮 */}
            {pixelatedResults.length > 0 && (
              <Button
                title={t('common.show_pixel_grid')}
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showPreviewPixelGrid ? 'primary' : 'default'}
              />
            )}
            <Button
              title={t('common.clear_preview')}
              icon={<ClearOutlined />}
              disabled={inPixelation}
              onClick={clearPreview}
            />
            {!isMobile && (
              <Button
                title={t('common.extend_mode')}
                onClick={toggleExtendMode}
                icon={
                  extendMode ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
              ></Button>
            )}
          </Space>
        </Flex>
      }
      className={styles.previewCard}
    >
      {pixelatedResults.length > 0 ? (
        <Row gutter={[12, 12]}>
          {pixelatedResults.map((res) => (
            <Col key={res.id} span={colSpan}>
              <PreviewCard
                tags={[
                  labelOf(algoOptions, res.algorithm),
                  labelOf(paletteOptions, res.palette),
                ]}
                originalFile={originalFile}
                pixelatedImage={res.url}
                pixelSize={res.pixelSize}
                showPixelGrid={showPreviewPixelGrid}
                saveButtonPlacement={isMobile ? 'bottom' : 'top'}
                showResizeHandle={!isMobile}
                editButtonPlacement={isMobile ? 'bottom' : 'top'}
                defaultPreviewHeight={defaultPreviewHeight}
              />
            </Col>
          ))}
          {/** 当多方案生成且生成中，生成占位卡片 */}
          {(() => {
            const expectedCount = multiAlgorithmEnabled
              ? taskFactorsOrder.reduce((prod, dim) => {
                  const len =
                    dim === TASK_FACTORS.ALGORITHM
                      ? selectedAlgorithms.length
                      : selectedPalettes.length;
                  return prod * Math.max(1, len);
                }, 1)
              : 1;
            const missingCount = inPixelation
              ? Math.max(0, expectedCount - pixelatedResults.length)
              : 0;
            return missingCount > 0
              ? Array.from({ length: missingCount }).map((_, i) => (
                  <Col key={`empty-${i}`} span={colSpan}>
                    <div
                      className={styles.emptyPreview}
                      style={{
                        height: `${defaultPreviewHeight}px`,
                      }}
                    >
                      <CenterSpin />
                    </div>
                  </Col>
                ))
              : null;
          })()}
        </Row>
      ) : (
        <PreviewCard
          originalFile={originalFile}
          pixelatedImage={''}
          showPixelGrid={showPreviewPixelGrid}
          saveButtonPlacement={isMobile ? 'bottom' : 'top'}
          showResizeHandle={!isMobile}
          defaultPreviewHeight={defaultPreviewHeight}
        />
      )}
    </Card>
  );
};

export default PreviewPanel;
