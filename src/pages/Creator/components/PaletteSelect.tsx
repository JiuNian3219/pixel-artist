import {
  getColorHex,
  getPaletteByName,
  paletteOptions,
  type Palette,
} from "@/utils/palettes";
import { BgColorsOutlined } from "@ant-design/icons";
import { Flex, Select, Space } from "antd";
import { useState } from "react";
import styles from "../index.module.less";

interface PaletteSelectProps {
  onChange: (value: Palette) => void;
  defaultValue?: string;
}

const PaletteSelect: React.FC<PaletteSelectProps> = ({
  onChange,
  defaultValue = "none",
}) => {
  const [paletteName, setPaletteName] = useState(defaultValue);
  const currentPalette = getPaletteByName(paletteName);

  const handleSelectChange = (value: string) => {
    setPaletteName(value);
    // useState 异步，所以直接使用 value 获取最新值
    const palette = getPaletteByName(value);
    onChange(palette);
  };

  return (
    <div className={styles.paletteSelect}>
      <Flex
        justify="space-between"
        wrap="wrap"
        gap={3}
      >
        <Space>
          <BgColorsOutlined />
          <span>色板选择</span>
        </Space>
        <Select
          options={paletteOptions}
          value={paletteName}
          onChange={handleSelectChange}
          style={{ width: 200 }}
        />
      </Flex>

      {currentPalette.colors.length > 0 && (
        <div className={styles.palettePreviewContainer}>
          {currentPalette.colors.map((color, index) => (
            <div
              key={index}
              className={styles.paletteColor}
              style={{ backgroundColor: getColorHex(color) }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaletteSelect;
