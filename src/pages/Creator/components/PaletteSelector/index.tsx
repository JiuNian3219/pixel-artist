import { useCreatorLocalStore } from "@/stores";
import {
  getColorHex,
  getPaletteById,
  getPaletteOptions,
} from "@/utils/palettes";
import { BgColorsOutlined } from "@ant-design/icons";
import { Flex, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./index.module.less";

interface PaletteSelectProps {
  value: string;
  onChange: (paletteId: string) => void;
  previewEnabled?: boolean;
}

const PaletteSelector: React.FC<PaletteSelectProps> = ({
  value,
  onChange,
  previewEnabled = false,
}) => {
  const { t } = useTranslation("creator");
  const currentPalette = getPaletteById(value);
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const paletteOptions = getPaletteOptions(t);

  return (
    <div
      className={styles.paletteSelect}
      style={{
        maxWidth: extendMode ? "200px" : "",
      }}
    >
      <Flex
        justify="space-between"
        wrap="wrap"
        gap={3}
      >
        <Space className={styles.settingLabel}>
          <BgColorsOutlined />
          <span>
            {previewEnabled
              ? t("multi_algorithm_panel.palette_preview")
              : t("palette_selector.title")}
          </span>
        </Space>
        <Select
          options={paletteOptions}
          value={value}
          onChange={onChange}
          style={{ minWidth: 200 }}
          popupMatchSelectWidth={false}
        />
      </Flex>

      {currentPalette.colors.length > 0 && (
        <div className={styles.palettePreviewContainer}>
          {currentPalette.colors.map((color, index) => (
            <div
              key={index}
              className={styles.paletteColor}
              style={{ backgroundColor: getColorHex(color) }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaletteSelector;
