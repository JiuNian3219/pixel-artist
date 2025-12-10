import { useIsMobile } from '@/hooks/useIsMobile';
import { useCreatorLocalStore } from '@/stores';
import { getPixelAlgorithmsOptions } from '@/utils/algorithm';
import { TASK_FACTORS } from '@/utils/constants';
import { getPaletteOptions } from '@/utils/palettes';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Flex, Space, Switch } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

interface MultiAlgorithmPanelProps {
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

const MultiAlgorithmPanel: React.FC<MultiAlgorithmPanelProps> = ({
  enabled,
  onChange,
}) => {
  const { t } = useTranslation('creator');
  const { t: paletteT } = useTranslation('common');
  const FACTOR_ORDER_NAME = {
    [TASK_FACTORS.ALGORITHM]: t('multi_algorithm_panel.algorithm'),
    [TASK_FACTORS.PALETTE]: t('multi_algorithm_panel.palette'),
  };
  const isMobile = useIsMobile();
  const pixelAlgorithmOptions = getPixelAlgorithmsOptions(t);
  const paletteOptions = getPaletteOptions(paletteT);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const selectedAlgorithms = useCreatorLocalStore(
    (state) => state.selectedAlgorithms
  );
  const selectedPalettes = useCreatorLocalStore(
    (state) => state.selectedPalettes
  );
  const setSelectedAlgorithms = useCreatorLocalStore(
    (state) => state.setSelectedAlgorithms
  );
  const setSelectedPalettes = useCreatorLocalStore(
    (state) => state.setSelectedPalettes
  );
  const taskFactorsOrder = useCreatorLocalStore(
    (state) => state.taskFactorsOrder
  );
  const setTaskFactorsOrder = useCreatorLocalStore(
    (state) => state.setTaskFactorsOrder
  );

  // 算法、调色板选中状态（全选 / 未选 / 部分选中）
  const algTotal = pixelAlgorithmOptions.length;
  const palTotal = paletteOptions.length;
  const algCount = selectedAlgorithms.length;
  const palCount = selectedPalettes.length;
  const algCheckedAll = algCount === algTotal;
  const palCheckedAll = palCount === palTotal;
  const algIndeterminate = algCount > 0 && algCount < algTotal;
  const palIndeterminate = palCount > 0 && palCount < palTotal;

  const handleMultiAlgorithmChange = (checked: boolean) => {
    onChange(checked);
  };
  const handleToggleSelectAllAlgorithms = (checked: boolean) => {
    if (checked) {
      setSelectedAlgorithms(pixelAlgorithmOptions.map((o) => o.value));
    } else {
      setSelectedAlgorithms([]);
    }
  };

  const handleToggleSelectAllPalettes = (checked: boolean) => {
    if (checked) {
      setSelectedPalettes(paletteOptions.map((o) => o.value));
    } else {
      setSelectedPalettes([]);
    }
  };

  const toggleAlgorithm = (value: string, checked: boolean) => {
    const next = new Set(selectedAlgorithms);
    if (checked) next.add(value);
    else next.delete(value);
    setSelectedAlgorithms(Array.from(next));
  };

  const togglePalette = (value: string, checked: boolean) => {
    const next = new Set(selectedPalettes);
    if (checked) next.add(value);
    else next.delete(value);
    setSelectedPalettes(Array.from(next));
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggingIndex === null || draggingIndex === index) return;
    const next = [...taskFactorsOrder];
    const [moved] = next.splice(draggingIndex, 1);
    next.splice(index, 0, moved);
    setTaskFactorsOrder(next);
    setDraggingIndex(null);
  };

  const handleFactorClick = (index: number) => {
    if (!isMobile) return;
    const next = [...taskFactorsOrder];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    setTaskFactorsOrder(next);
  };

  return (
    <div className={styles.multiAlgorithmPanel}>
      <Flex justify="space-between" wrap="wrap" gap={3}>
        <Space className={styles.settingLabel}>
          <DeploymentUnitOutlined />
          <span>{t('multi_algorithm_panel.title')}</span>
        </Space>
        <Switch checked={enabled} onChange={handleMultiAlgorithmChange} />
      </Flex>

      <div
        className={`${styles.rollContainer} ${enabled ? styles.rollOpen : ''}`}
        aria-hidden={!enabled}
      >
        {/* 算法选项 */}
        <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
          <span className={styles.miniSettingLabel}>
            {t('control_panel.pixel_algorithm_select')}
          </span>
          <Checkbox
            checked={algCheckedAll}
            indeterminate={algIndeterminate}
            onChange={(e) => handleToggleSelectAllAlgorithms(e.target.checked)}
          />
        </Flex>

        <Divider className={styles.divider} />
        <Flex wrap="wrap" gap={8}>
          {pixelAlgorithmOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={selectedAlgorithms.includes(opt.value)}
              onChange={(e) => toggleAlgorithm(opt.value, e.target.checked)}
              className={styles.checkboxLabel}
            >
              {opt.label}
            </Checkbox>
          ))}
        </Flex>
        {/* 调色板选项 */}
        <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
          <span className={styles.miniSettingLabel}>
            {t('control_panel.palette_select')}
          </span>
          <Checkbox
            checked={palCheckedAll}
            indeterminate={palIndeterminate}
            onChange={(e) => handleToggleSelectAllPalettes(e.target.checked)}
          />
        </Flex>
        <Divider className={styles.divider} />
        <Flex wrap="wrap" gap={8}>
          {paletteOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={selectedPalettes.includes(opt.value)}
              onChange={(e) => togglePalette(opt.value, e.target.checked)}
              className={styles.checkboxLabel}
            >
              {opt.label}
            </Checkbox>
          ))}
        </Flex>
        <Divider className={styles.divider} />
        {/* 排列方式 */}
        <Flex justify="space-between" align="center">
          <span className={styles.miniSettingLabel}>
            {t('multi_algorithm_panel.factor_order')}
          </span>
          <Flex gap={8} wrap="wrap" className={styles.factorOrder}>
            {taskFactorsOrder.map((f, idx) => (
              <div
                key={`${f}-${idx}`}
                draggable={!isMobile}
                onClick={() => handleFactorClick(idx)}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={styles.factorOrderItem}
                title={t('multi_algorithm_panel.factor_order_hint')}
              >
                {FACTOR_ORDER_NAME[f]}
              </div>
            ))}
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default MultiAlgorithmPanel;
