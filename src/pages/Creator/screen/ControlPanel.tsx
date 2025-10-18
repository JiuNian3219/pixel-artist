import {
  BgColorsOutlined,
  HighlightOutlined,
  SearchOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Flex,
  Popover,
  Select,
  Slider,
  Space,
} from "antd";
import { Typography } from "antd/lib";
import ImageUploader from "../components/ImageUploader";
import PaletteSelector from "../components/PaletteSelector";
import useControlPanel from "../handles/useControlPanel";
import styles from "../index.module.less";
import { MAX_PIXEL_SIZE, MIN_PIXEL_SIZE } from "../utils";

interface ControlPanelProps {
  setOriginalFile: (file: File | null) => void;
  setPixelatedImage: (url: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  setOriginalFile,
  setPixelatedImage,
}) => {
  const {
    t,
    extendMode,
    originalImage,
    inPixelation,
    pixelSize,
    paletteName,
    pixelAlgorithm,
    pixelAlgorithmOptions,
    handleImageChange,
    handleChangePixelSize,
    handlePixelAlgorithmChange,
    handlePaletteChange,
    handlePixelate,
  } = useControlPanel({
    setOriginalFile,
    setPixelatedImage,
  });
  return extendMode ? (
    <div className={styles.miniControlPanel}>
      <ImageUploader
        onImageChange={handleImageChange}
        mode="button"
      />
      <Button
        type="primary"
        shape="circle"
        icon={<HighlightOutlined />}
        disabled={!originalImage}
        onClick={handlePixelate}
        loading={inPixelation}
        className={styles.miniPixelateButton}
      ></Button>
      <div className={styles.miniSetting}>
        <div className={styles.settingButtonGroup}>
          {/* 像素尺寸设置 */}
          <Popover
            content={
              <div className={styles.popoverContent}>
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Space>
                    <TableOutlined />
                    <span>{t("control_panel.pixel_size_slider")}</span>
                  </Space>
                  <Typography className={styles.pixelSize}>
                    {pixelSize}px
                  </Typography>
                </Flex>

                <Slider
                  min={MIN_PIXEL_SIZE}
                  max={MAX_PIXEL_SIZE}
                  value={pixelSize}
                  tooltip={{ formatter: null }}
                  onChange={handleChangePixelSize}
                />
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              shape="circle"
              icon={<TableOutlined />}
              className={styles.settingButton}
            />
          </Popover>

          {/** 算法选择 */}
          <Popover
            content={
              <div className={styles.popoverContent}>
                <Flex
                  vertical
                  align="flex-start"
                  gap={8}
                >
                  <Space>
                    <SearchOutlined />
                    <span>{t("control_panel.pixel_algorithm_select")}</span>
                  </Space>
                  <Select
                    value={pixelAlgorithm}
                    options={pixelAlgorithmOptions}
                    onChange={handlePixelAlgorithmChange}
                    style={{ width: "100%" }}
                  />
                </Flex>
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              className={styles.settingButton}
            />
          </Popover>

          {/* 调色板选择 */}
          <Popover
            content={
              <div className={styles.popoverContent}>
                <PaletteSelector
                  value={paletteName}
                  onChange={handlePaletteChange}
                />
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              shape="circle"
              icon={<BgColorsOutlined />}
              className={styles.settingButton}
            />
          </Popover>
        </div>
      </div>
    </div>
  ) : (
    <Card
      title={
        <Space>
          <SettingOutlined />
          {t("control_panel.title")}
        </Space>
      }
      className={styles.controlCard}
    >
      {/** 图片上传 */}
      <ImageUploader
        onImageChange={handleImageChange}
        originalImage={originalImage}
      />

      {/** 像素化按钮 */}
      <Button
        type="primary"
        icon={<HighlightOutlined />}
        disabled={!originalImage}
        onClick={handlePixelate}
        loading={inPixelation}
        className={styles.pixelateButton}
      >
        {t("control_panel.to_pixel_button")}
      </Button>
      <Divider />

      {/** 像素尺寸设置 */}
      <Flex
        justify="space-between"
        align="center"
      >
        <Space>
          <TableOutlined />
          <span>{t("control_panel.pixel_size_slider")}</span>
        </Space>
        <Typography className={styles.pixelSize}>{pixelSize}px</Typography>
      </Flex>

      <Slider
        min={MIN_PIXEL_SIZE}
        max={MAX_PIXEL_SIZE}
        value={pixelSize}
        tooltip={{ formatter: null }}
        onChange={handleChangePixelSize}
      />

      {/** 算法选择 */}
      <Flex
        justify="space-between"
        wrap="wrap"
        gap={3}
      >
        <Space>
          <SearchOutlined />
          <span>{t("control_panel.pixel_algorithm_select")}</span>
        </Space>
        <Select
          value={pixelAlgorithm}
          options={pixelAlgorithmOptions}
          onChange={handlePixelAlgorithmChange}
          style={{ width: 200 }}
        />
      </Flex>

      {/** 调色板选择 */}
      <PaletteSelector
        value={paletteName}
        onChange={handlePaletteChange}
      />
    </Card>
  );
};

export default ControlPanel;
