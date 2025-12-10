import { useEditorUIStore } from '@/stores/editorUIStore';
import { DEFAULT_COLOR_PALETTE } from '@/utils/constants';
import {
  getColorHex,
  getPaletteById,
  getPaletteOptions,
} from '@/utils/palettes';
import { ColorPicker, Flex, Select, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

interface PaletteSelectProps {
  value: string;
  onChange: (paletteId: string) => void;
}

const PaletteSelector: React.FC<PaletteSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation('editor');
  const { t: paletteT } = useTranslation('common');
  const color = useEditorUIStore((s) => s.color);
  const setColor = useEditorUIStore((state) => state.setColor);
  const currentPalette = getPaletteById(value);
  const paletteOptions = getPaletteOptions(paletteT);

  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChangeByAll = (colorObj: Color) => {
    setLocalColor(colorObj.toHexString());
  };

  const handleColorChangeByAllComplete = (colorObj: Color) => {
    setColor(colorObj.toHexString());
  };

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  return (
    <div className={styles.paletteSelect}>
      <Flex justify="space-between" align="center" gap={12}>
        <Typography.Title level={5} className={styles.settingLabel}>
          {t('palette_selector.title')}
        </Typography.Title>
        <Select
          options={paletteOptions}
          value={value}
          onChange={onChange}
          style={{ width: '100%' }}
          popupMatchSelectWidth={false}
        />
      </Flex>

      {currentPalette.colors.length > 0 && (
        <div className={styles.palettePreviewContainer}>
          {currentPalette.colors.map((color, index) => {
            const colorHex = getColorHex(color);
            return (
              <div
                key={index}
                className={styles.paletteColor}
                style={{ backgroundColor: colorHex }}
                onClick={() => handleColorChange(colorHex)}
              />
            );
          })}
        </div>
      )}
      {/** 全色调色板，展示颜色选择器 */}
      {value === DEFAULT_COLOR_PALETTE && (
        <ColorPicker
          value={localColor}
          disabledAlpha
          onChange={handleColorChangeByAll}
          onChangeComplete={handleColorChangeByAllComplete}
        />
      )}
    </div>
  );
};

export default PaletteSelector;
