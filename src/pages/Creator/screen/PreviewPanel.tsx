import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import { getPixelAlgorithmsOptions } from "@/utils/algorithm";
import { TASK_FACTORS } from "@/utils/constants";
import { getPaletteOptions } from "@/utils/palettes";
import {
  BorderOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Space, Spin } from "antd";
import { useTranslation } from "react-i18next";
import PreviewCard from "../components/PreviewCard";
import styles from "../index.module.less";

interface PreviewPanelProps {
  originalFile: File | null;
  pixelatedResults?: { url: string; algorithm: string; palette: string }[];
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  originalFile,
  pixelatedResults = [],
}) => {
  const { t } = useTranslation("creator");
  const isMobile = useIsMobile();
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const setExtendMode = useCreatorLocalStore((state) => state.setExtendMode);
  const showPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.showPreviewPixelGrid
  );
  const setShowPreviewPixelGrid = useCreatorLocalStore(
    (state) => state.setShowPreviewPixelGrid
  );
  const inPixelation = useCreatorLocalStore((state) => state.inPixelation);
  const multiAlgorithmEnabled = useCreatorLocalStore(
    (state) => state.multiAlgorithmEnabled
  );
  const selectedAlgorithms = useCreatorLocalStore(
    (state) => state.selectedAlgorithms
  );
  const selectedPalettes = useCreatorLocalStore(
    (state) => state.selectedPalettes
  );
  const taskFactorsOrder = useCreatorLocalStore(
    (state) => state.taskFactorsOrder
  );

  const algoOptions = getPixelAlgorithmsOptions(t);
  const paletteOptions = getPaletteOptions(t);
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

  return (
    <Card
      title={
        <Flex
          justify="space-between"
          align="center"
        >
          <Space>
            <EyeOutlined />
            {t("preview_panel.title")}
          </Space>
          <Space>
            {/* 网格显示切换按钮 */}
            {pixelatedResults.length > 0 && (
              <Button
                title={t("common.show_pixel_grid")}
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showPreviewPixelGrid ? "primary" : "default"}
                size="small"
              />
            )}
            {!isMobile && (
              <Button
                title={t("common.extend_mode")}
                onClick={toggleExtendMode}
                style={{
                  fontSize: "20px",
                }}
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
        <>
          {pixelatedResults.map((res, idx) => (
            <PreviewCard
              key={`${res.algorithm}-${res.palette}-${idx}`}
              tags={[
                labelOf(algoOptions, res.algorithm),
                labelOf(paletteOptions, res.palette),
              ]}
              originalFile={originalFile}
              pixelatedImage={res.url}
              showPixelGrid={showPreviewPixelGrid}
              saveButtonPlacement={isMobile ? "bottom" : "top"}
              showResizeHandle={!isMobile}
            />
          ))}
          {/** 当多方案生成且生成中，提示加载动画 */}
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
            return inPixelation && pixelatedResults.length < expectedCount ? (
              <Flex
                justify="center"
                style={{ marginTop: 12 }}
              >
                <Spin tip="生成中..." />
              </Flex>
            ) : null;
          })()}
        </>
      ) : (
        <PreviewCard
          originalFile={originalFile}
          pixelatedImage={""}
          showPixelGrid={showPreviewPixelGrid}
          saveButtonPlacement={isMobile ? "bottom" : "top"}
          showResizeHandle={!isMobile}
        />
      )}
    </Card>
  );
};

export default PreviewPanel;
