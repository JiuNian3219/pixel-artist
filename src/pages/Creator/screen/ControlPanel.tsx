import { useCreatorLocalStore } from "@/stores";
import {
  getPixelAlgorithm,
  getPixelAlgorithmsOptions,
} from "@/utils/algorithm";
import { findClosestColor, getPaletteById } from "@/utils/palettes";
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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploader from "../components/ImageUploader";
import PaletteSelector from "../components/PaletteSelector";
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
  const pixelSize = useCreatorLocalStore((state) => state.pixelSize);
  const setPixelSize = useCreatorLocalStore((state) => state.setPixelSize);
  const pixelAlgorithm = useCreatorLocalStore((state) => state.pixelAlgorithm);
  const setPixelAlgorithm = useCreatorLocalStore(
    (state) => state.setPixelAlgorithm
  );
  const paletteName = useCreatorLocalStore((state) => state.paletteName);
  const setPaletteName = useCreatorLocalStore((state) => state.setPaletteName);
  const extendMode = useCreatorLocalStore((state) => state.extendMode);

  const [originalImage, setOriginalImage] = useState<string>("");
  const [inPixelation, setInPixelation] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { t } = useTranslation("creator");
  const pixelAlgorithmOptions = getPixelAlgorithmsOptions(t);

  const handlePaletteChange = (paletteName: string) => {
    setPaletteName(paletteName);
  };

  const handleChangePixelSize = (value: number) => {
    setPixelSize(value);
  };

  const handlePixelAlgorithmChange = (value: string) => {
    setPixelAlgorithm(value);
  };

  const handleImageChange = (file: File | null, url: string) => {
    setImageFile(file);
    setOriginalFile(file);
    setOriginalImage(url);
    setPixelatedImage("");
  };

  // 处理像素化转换
  const handlePixelate = () => {
    if (!imageFile || !originalImage) return;
    setInPixelation(true);

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const pixelatedData = pixelateImage(data, width, height, pixelSize);

      const newImageData = new ImageData(pixelatedData, width, height);
      ctx.putImageData(newImageData, 0, 0);

      const pixelatedUrl = canvas.toDataURL("image/png");
      setPixelatedImage(pixelatedUrl);
      setInPixelation(false);
    };
  };

  // 像素化图片函数
  const pixelateImage = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    pixelSize: number
  ) => {
    // 创建新的数据数组
    const newData = new Uint8ClampedArray(data.length);

    // 遍历每个像素块
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // 计算当前像素块的合适颜色
        let pixelColor = getPixelAlgorithm(pixelAlgorithm)(
          data,
          width,
          height,
          x,
          y,
          pixelSize
        );
        // 如果选择了色板，将颜色映射到最相近的色板颜色
        pixelColor = {
          ...findClosestColor(pixelColor, getPaletteById(paletteName).colors),
          a: pixelColor.a,
        };

        // 将平均颜色应用到整个像素块
        for (
          let blockY = 0;
          blockY < pixelSize && y + blockY < height;
          blockY++
        ) {
          for (
            let blockX = 0;
            blockX < pixelSize && x + blockX < width;
            blockX++
          ) {
            const pixelIndex = ((y + blockY) * width + (x + blockX)) * 4;
            newData[pixelIndex] = pixelColor.r;
            newData[pixelIndex + 1] = pixelColor.g;
            newData[pixelIndex + 2] = pixelColor.b;
            newData[pixelIndex + 3] = pixelColor.a;
          }
        }
      }
    }

    return newData;
  };

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
