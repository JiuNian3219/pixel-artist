import {
  useCreatorDataStore,
  useCreatorLocalStore,
  useCreatorStore,
} from '@/stores';
import { getPixelAlgorithmsOptions } from '@/utils/algorithm';
import {
  MAX_PIXEL_SIZE,
  MAX_PREVIEW_HEIGHT,
  MIN_PIXEL_SIZE,
  MIN_PREVIEW_HEIGHT,
  TASK_FACTORS,
} from '@/utils/constants';
import { ResultType, SendType } from '@/workers/constants';
import { pixelWorkerManager } from '@/workers/manager';
import {
  BgColorsOutlined,
  ClearOutlined,
  ColumnHeightOutlined,
  DeploymentUnitOutlined,
  HighlightOutlined,
  SearchOutlined,
  SettingOutlined,
  StopOutlined,
  TableOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Flex,
  Popover,
  Select,
  Slider,
  Space,
} from 'antd';
import { Typography } from 'antd/lib';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploader from '../components/ImageUploader';
import MultiAlgorithmPanel from '../components/MultiAlgorithmPanel';
import PaletteSelector from '../components/PaletteSelector';
import styles from '../index.module.less';

interface ControlPanelProps {
  setOriginalFile: (file: File | null) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ setOriginalFile }) => {
  const pixelSize = useCreatorLocalStore((state) => state.pixelSize);
  const setPixelSize = useCreatorLocalStore((state) => state.setPixelSize);
  const [uiPixelSize, setUiPixelSize] = useState<number>(pixelSize);
  const debouncedSetPixelSize = useMemo(
    () => debounce((v: number) => setPixelSize(v), 200),
    [setPixelSize]
  );
  const defaultPreviewHeight = useCreatorLocalStore(
    (state) => state.defaultPreviewHeight
  );
  const setDefaultPreviewHeight = useCreatorLocalStore(
    (state) => state.setDefaultPreviewHeight
  );
  const pixelAlgorithm = useCreatorLocalStore((state) => state.pixelAlgorithm);
  const multiAlgorithmEnabled = useCreatorLocalStore(
    (state) => state.multiAlgorithmEnabled
  );
  const setPixelAlgorithm = useCreatorLocalStore(
    (state) => state.setPixelAlgorithm
  );
  const setMultiAlgorithmEnabled = useCreatorLocalStore(
    (state) => state.setMultiAlgorithmEnabled
  );
  const paletteName = useCreatorLocalStore((state) => state.paletteName);
  const setPaletteName = useCreatorLocalStore((state) => state.setPaletteName);
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const selectedAlgorithms = useCreatorLocalStore(
    (state) => state.selectedAlgorithms
  );
  const selectedPalettes = useCreatorLocalStore(
    (state) => state.selectedPalettes
  );
  const taskFactorsOrder = useCreatorLocalStore(
    (state) => state.taskFactorsOrder
  );
  const inPixelation = useCreatorStore((state) => state.inPixelation);
  const setInPixelation = useCreatorStore((state) => state.setInPixelation);

  const [originalImage, setOriginalImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { t } = useTranslation('creator');
  const {
    setOriginalImage: saveOriginalImage,
    restoreWorkspace,
    clearResults,
    clearWorkspace,
    setGenerationConfig,
    addResult,
  } = useCreatorDataStore();
  const results = useCreatorDataStore((state) => state.results);
  const generationConfig = useCreatorDataStore(
    (state) => state.generationConfig
  );

  const pixelAlgorithmOptions = getPixelAlgorithmsOptions(t);

  const handlePaletteChange = (paletteName: string) => {
    setPaletteName(paletteName);
  };

  const handleChangePixelSize = (value: number) => {
    setUiPixelSize(value);
    debouncedSetPixelSize(value);
  };

  // 预览高度百分比与像素的互相转换（30% -> 250px，100% -> 800px）
  const percentToPx = (percent: number): number => {
    const k = (percent - 30) / 70;
    const px =
      MIN_PREVIEW_HEIGHT + k * (MAX_PREVIEW_HEIGHT - MIN_PREVIEW_HEIGHT);
    return Math.round(px);
  };

  const pxToPercent = (px: number): number => {
    const k =
      (px - MIN_PREVIEW_HEIGHT) / (MAX_PREVIEW_HEIGHT - MIN_PREVIEW_HEIGHT);
    const percent = 30 + k * 70;
    return Math.round(percent);
  };

  const [uiPreviewHeightPercent, setUiPreviewHeightPercent] = useState<number>(
    pxToPercent(defaultPreviewHeight)
  );
  const debouncedSetDefaultPreviewHeight = useMemo(
    () =>
      debounce(
        (percent: number) => setDefaultPreviewHeight(percentToPx(percent)),
        200
      ),
    [setDefaultPreviewHeight]
  );

  useEffect(() => {
    return () => {
      debouncedSetPixelSize.cancel();
      debouncedSetDefaultPreviewHeight.cancel();
    };
  }, [debouncedSetPixelSize, debouncedSetDefaultPreviewHeight]);

  const handlePixelAlgorithmChange = (value: string) => {
    setPixelAlgorithm(value);
  };

  const handleMultiAlgorithmChange = (checked: boolean) => {
    setMultiAlgorithmEnabled(checked);
  };

  const handleImageChange = (file: File | null, url: string) => {
    setImageFile(file);
    setOriginalFile(file);
    setOriginalImage(url);
    clearResults();

    if (file) {
      saveOriginalImage(file);
    }
  };

  const handleClearWorkspace = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    pixelWorkerManager.terminate();
    setInPixelation(false);
    await clearWorkspace();
    setImageFile(null);
    setOriginalFile(null);
    setOriginalImage('');
  };

  const handleStopGeneration = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    pixelWorkerManager.terminate();
    setInPixelation(false);
  };

  // 可以像素画的条件：必须已选择图片，且如果开启多方案模式，其下至少选择一个算法与一个调色板
  const canPixelate =
    !!originalImage &&
    (!multiAlgorithmEnabled ||
      (selectedAlgorithms.length > 0 && selectedPalettes.length > 0));

  // 处理像素化转换
  const handlePixelate = () => {
    if (!imageFile || !originalImage) return;
    setInPixelation(true);

    const img = new Image();
    img.src = originalImage;

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const tasks = multiAlgorithmEnabled
        ? (() => {
            // 根据排列因子顺序进行笛卡尔积展开
            const order = taskFactorsOrder;
            let acc: { algorithm?: string; palette?: string }[] = [{}];
            for (const dim of order) {
              const values =
                dim === TASK_FACTORS.ALGORITHM
                  ? selectedAlgorithms
                  : selectedPalettes;
              if (values.length === 0) {
                acc = [];
                break;
              }
              const next: { algorithm?: string; palette?: string }[] = [];
              for (const item of acc) {
                for (const v of values) {
                  next.push({
                    ...item,
                    [dim]: v,
                  });
                }
              }
              acc = next;
            }
            return acc.map((it) => ({
              algorithm: it.algorithm!,
              palette: it.palette!,
            }));
          })()
        : [{ algorithm: pixelAlgorithm, palette: paletteName }];

      // 多方案模式下，若任务集为空，则直接结束
      if (tasks.length === 0) {
        setInPixelation(false);
        return;
      }

      // 保存生成配置
      // 关键点!!!：必须在 postMessage 之前执行！
      // 下方的 postMessage 会通过 Transferable Objects 将 imageBuffer 的所有权“转移”给 Worker（零拷贝以提升性能）。
      // 转移后，主线程中的 buffer 会立即被清空（Neutered），若此时再尝试读取或保存将会失败。
      await setGenerationConfig({
        totalTasks: tasks.length,
        workerPayload: {
          data,
          width,
          height,
          pixelSize,
          tasks,
        },
      });

      // 开始前清空预览结果
      await clearResults();

      pixelWorkerManager.postMessage(
        {
          type: SendType.PIXELATE_BATCH,
          payload: {
            data,
            width,
            height,
            pixelSize,
            tasks,
          },
        },
        [data.buffer]
      );
    };
  };

  useEffect(() => {
    const initWorkspace = async () => {
      if (!originalImage) {
        const {
          file,
          results: restoredResults,
          config,
        } = await restoreWorkspace();
        if (file) {
          const url = URL.createObjectURL(file);
          setOriginalImage(url);
          setImageFile(file);
          setOriginalFile(file);
        }

        if (config && restoredResults.length < config.totalTasks) {
          const completedKeys = new Set(
            restoredResults.map((r) => `${r.algorithm}-${r.palette}`)
          );
          const remainingTasks = config.workerPayload.tasks.filter(
            (t) => !completedKeys.has(`${t.algorithm}-${t.palette}`)
          );

          if (remainingTasks.length > 0) {
            setInPixelation(true);
            const { data } = config.workerPayload;
            if (data && data.buffer) {
              pixelWorkerManager.postMessage(
                {
                  type: SendType.PIXELATE_BATCH,
                  payload: {
                    ...config.workerPayload,
                    tasks: remainingTasks,
                  },
                },
                [data.buffer]
              );
            }
          }
        }
      }
    };

    initWorkspace();

    const unsubscribe = pixelWorkerManager.subscribe(async (msg) => {
      if (msg.type === ResultType.RESULT) {
        const { data, width, height, algorithm, palette, pixelSize } =
          msg.payload;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = new ImageData(data as any, width, height);
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await addResult({
                algorithm,
                palette,
                pixelSize,
                blob,
                url: URL.createObjectURL(blob),
              });
            }
          }, 'image/png');
        }
      } else if (msg.type === ResultType.COMPLETE) {
        setInPixelation(false);
      }
    });
    return unsubscribe;
  }, []);

  return extendMode ? (
    <div className={styles.miniControlPanel}>
      <ImageUploader
        onImageChange={handleImageChange}
        disabled={inPixelation}
        mode="button"
      />
      <Button
        title={
          inPixelation
            ? `${t('control_panel.stop_generation')} (${
                generationConfig?.totalTasks
                  ? `${results.length}/${generationConfig.totalTasks}`
                  : ''
              })`
            : t('control_panel.to_pixel_button')
        }
        type={inPixelation ? 'default' : 'primary'}
        danger={inPixelation}
        shape="circle"
        icon={inPixelation ? <StopOutlined /> : <HighlightOutlined />}
        disabled={!canPixelate && !inPixelation}
        onClick={inPixelation ? handleStopGeneration : handlePixelate}
        className={styles.miniPixelateButton}
      ></Button>
      <div className={styles.miniSetting}>
        <div className={styles.settingButtonGroup}>
          {/* 像素尺寸设置 */}
          <Popover
            content={
              <div style={{ width: '200px' }}>
                <Flex justify="space-between" align="center">
                  <Space>
                    <TableOutlined />
                    <span>{t('control_panel.pixel_size_slider')}</span>
                  </Space>
                  <Typography className={styles.pixelSize}>
                    {uiPixelSize}px
                  </Typography>
                </Flex>

                <Slider
                  min={MIN_PIXEL_SIZE}
                  max={MAX_PIXEL_SIZE}
                  value={uiPixelSize}
                  tooltip={{ formatter: null }}
                  onChange={handleChangePixelSize}
                />
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              title={t('control_panel.pixel_size_slider')}
              shape="circle"
              icon={<TableOutlined />}
              className={styles.settingButton}
            />
          </Popover>

          {/* 预览高度设置（30% - 100%，对应 250px - 800px） */}
          <Popover
            content={
              <div style={{ width: '200px' }}>
                <Flex justify="space-between" align="center">
                  <Space>
                    <ColumnHeightOutlined />
                    <span>{t('control_panel.preview_height_slider')}</span>
                  </Space>
                  <Typography className={styles.pixelSize}>
                    {uiPreviewHeightPercent}%
                  </Typography>
                </Flex>

                <Slider
                  min={30}
                  max={100}
                  value={uiPreviewHeightPercent}
                  tooltip={{ formatter: null }}
                  onChange={(v) => {
                    setUiPreviewHeightPercent(v as number);
                    debouncedSetDefaultPreviewHeight(v as number);
                  }}
                />
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              title={t('control_panel.preview_height_slider')}
              shape="circle"
              icon={<ColumnHeightOutlined />}
              className={styles.settingButton}
            />
          </Popover>

          {/** 算法选择 */}
          {!multiAlgorithmEnabled && (
            <Popover
              content={
                <div>
                  <Flex vertical align="flex-start" gap={8}>
                    <Space>
                      <SearchOutlined />
                      <span>{t('control_panel.pixel_algorithm_select')}</span>
                    </Space>
                    <Select
                      value={pixelAlgorithm}
                      options={pixelAlgorithmOptions}
                      onChange={handlePixelAlgorithmChange}
                      style={{ width: '200px' }}
                      popupMatchSelectWidth={false}
                    />
                  </Flex>
                </div>
              }
              placement="left"
              trigger="click"
            >
              <Button
                shape="circle"
                title={t('control_panel.pixel_algorithm_select')}
                icon={<SearchOutlined />}
                className={styles.settingButton}
              />
            </Popover>
          )}

          {/* 调色板选择 */}
          <Popover
            content={
              <PaletteSelector
                value={paletteName}
                onChange={handlePaletteChange}
                previewEnabled={multiAlgorithmEnabled}
              />
            }
            placement="left"
            trigger="click"
          >
            <Button
              title={t('palette_selector.title')}
              shape="circle"
              icon={<BgColorsOutlined />}
              className={styles.settingButton}
            />
          </Popover>
          {/** 多方案生成 */}
          <Popover
            content={
              <div style={{ width: '400px' }}>
                <MultiAlgorithmPanel
                  enabled={multiAlgorithmEnabled}
                  onChange={handleMultiAlgorithmChange}
                />
              </div>
            }
            placement="left"
            trigger="click"
          >
            <Button
              shape="circle"
              title={t('multi_algorithm_panel.title')}
              icon={<DeploymentUnitOutlined />}
              className={styles.settingButton}
            />
          </Popover>
        </div>

        {originalImage && (
          <Button
            title={t('control_panel.clear_workspace')}
            shape="circle"
            danger
            icon={<ClearOutlined />}
            className={styles.clearButton}
            onClick={handleClearWorkspace}
          />
        )}
      </div>
    </div>
  ) : (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Space>
            <SettingOutlined />
            {t('control_panel.title')}
          </Space>
          {originalImage && (
            <Button
              type="text"
              danger
              icon={<ClearOutlined />}
              onClick={handleClearWorkspace}
              title={t('control_panel.clear_workspace')}
            />
          )}
        </Flex>
      }
      className={styles.controlCard}
    >
      {/** 图片上传 */}
      <ImageUploader
        onImageChange={handleImageChange}
        originalImage={originalImage}
        disabled={inPixelation}
      />

      {/** 像素化按钮 */}
      <Button
        title={
          inPixelation
            ? t('control_panel.stop_generation')
            : t('control_panel.to_pixel_button')
        }
        type={inPixelation ? 'default' : 'primary'}
        danger={inPixelation}
        icon={inPixelation ? <StopOutlined /> : <HighlightOutlined />}
        disabled={!canPixelate && !inPixelation}
        onClick={inPixelation ? handleStopGeneration : handlePixelate}
        className={styles.pixelateButton}
      >
        {inPixelation
          ? `${t('control_panel.stop_generation')} (${
              generationConfig?.totalTasks
                ? `${results.length}/${generationConfig.totalTasks}`
                : ''
            })`
          : t('control_panel.to_pixel_button')}
      </Button>
      <Divider />

      {/** 像素尺寸设置 */}
      <Flex justify="space-between" align="center">
        <Space className={styles.settingLabel}>
          <TableOutlined />
          <span>{t('control_panel.pixel_size_slider')}</span>
        </Space>
        <Typography className={styles.pixelSize}>{uiPixelSize}px</Typography>
      </Flex>

      <Slider
        min={MIN_PIXEL_SIZE}
        max={MAX_PIXEL_SIZE}
        value={uiPixelSize}
        tooltip={{ formatter: null }}
        onChange={handleChangePixelSize}
      />

      {/** 预览高度设置（30% - 100%，对应 250px - 800px） */}
      <Flex justify="space-between" align="center">
        <Space className={styles.settingLabel}>
          <ColumnHeightOutlined />
          <span>{t('control_panel.preview_height_slider')}</span>
        </Space>
        <Typography className={styles.pixelSize}>
          {uiPreviewHeightPercent}%
        </Typography>
      </Flex>

      <Slider
        min={30}
        max={100}
        value={uiPreviewHeightPercent}
        tooltip={{ formatter: null }}
        onChange={(v) => {
          setUiPreviewHeightPercent(v as number);
          debouncedSetDefaultPreviewHeight(v as number);
        }}
      />

      {/** 算法选择 */}
      {!multiAlgorithmEnabled && (
        <Flex justify="space-between" wrap="wrap" gap={3}>
          <Space className={styles.settingLabel}>
            <SearchOutlined />
            <span>{t('control_panel.pixel_algorithm_select')}</span>
          </Space>
          <Select
            value={pixelAlgorithm}
            options={pixelAlgorithmOptions}
            onChange={handlePixelAlgorithmChange}
            popupMatchSelectWidth={false}
            style={{ width: 200 }}
          />
        </Flex>
      )}

      {/** 调色板选择 */}
      <PaletteSelector
        value={paletteName}
        onChange={handlePaletteChange}
        previewEnabled={multiAlgorithmEnabled}
      />

      {/* 多方案生成 */}
      <MultiAlgorithmPanel
        enabled={multiAlgorithmEnabled}
        onChange={handleMultiAlgorithmChange}
      />
    </Card>
  );
};

export default ControlPanel;
