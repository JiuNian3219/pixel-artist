import {
  findClosestColor,
  getPaletteByName,
  type Palette,
} from "@/utils/palettes";
import {
  HighlightOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Flex, Slider, Space } from "antd";
import { Typography } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploader from "../components/ImageUploader";
import PaletteSelect from "../components/PaletteSelect";
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
  const [pixelSize, setPixelSize] = useState<number>(16);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [inPixelation, setInPixelation] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [palette, setPalette] = useState<Palette>(getPaletteByName("全色色板"));
  const { t } = useTranslation("creator");

  const handlePaletteChange = (palette: Palette) => {
    setPalette(palette);
  };

  const handleChangePixelSize = (value: number) => {
    setPixelSize(value);
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

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      setInPixelation(true);
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
        // 计算当前像素块的平均颜色
        let avgColor = getAverageColor(data, width, height, x, y, pixelSize);
        // 如果选择了色板，将颜色映射到最相近的色板颜色
        if (palette) {
          avgColor = {
            ...findClosestColor(avgColor, palette.colors),
            a: avgColor.a,
          };
        }

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
            newData[pixelIndex] = avgColor.r; // R
            newData[pixelIndex + 1] = avgColor.g; // G
            newData[pixelIndex + 2] = avgColor.b; // B
            newData[pixelIndex + 3] = avgColor.a; // A
          }
        }
      }
    }

    return newData;
  };

  // 计算像素块的平均颜色
  const getAverageColor = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startX: number,
    startY: number,
    pixelSize: number
  ) => {
    let r = 0,
      g = 0,
      b = 0,
      a = 0;
    let count = 0;

    for (let y = 0; y < pixelSize && startY + y < height; y++) {
      for (let x = 0; x < pixelSize && startX + x < width; x++) {
        const pixelIndex = ((startY + y) * width + (startX + x)) * 4;
        r += data[pixelIndex];
        g += data[pixelIndex + 1];
        b += data[pixelIndex + 2];
        a += data[pixelIndex + 3];
        count++;
      }
    }

    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
      a: Math.round(a / count),
    };
  };

  return (
    <Card
      title={
        <Space>
          <SettingOutlined />
          {t("control_panel.title")}
        </Space>
      }
      className={styles.leftCard}
    >
      <ImageUploader onImageChange={handleImageChange} />

      <Button
        type="primary"
        icon={<HighlightOutlined />}
        disabled={!originalImage}
        onClick={handlePixelate}
        loading={inPixelation}
      >
        {t("control_panel.to_pixel_button")}
      </Button>
      <Divider />
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

      <PaletteSelect
        defaultValue="全色色板"
        onChange={handlePaletteChange}
      />
    </Card>
  );
};

export default ControlPanel;
