import GlobalLoadingOverlay from '@/components/GlobalLoadingOverlay';
import { useCreatorLocalStore } from '@/stores/creatorStore';
import { useEditorDataStore } from '@/stores/editorDataStore';
import {
  MAX_COLUMNS,
  MAX_PREVIEW_HEIGHT,
  MAX_ROWS,
  MIN_PREVIEW_HEIGHT,
} from '@/utils/constants';
import { parseDataUrlToGridPixels } from '@/utils/image';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, message, Modal, Row, Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TAG_COLORS } from '../../utils';
import PixelGrid from '../PixelGrid';
import styles from './index.module.less';

type ButtonPlacement = 'top' | 'bottom';

interface PreviewCardProps {
  originalFile: File | null;
  pixelatedImage: string;
  defaultPreviewHeight?: number;
  showPixelGrid: boolean;
  showSaveButton?: boolean;
  saveButtonPlacement?: ButtonPlacement;
  showEditButton?: boolean;
  editButtonPlacement?: ButtonPlacement;
  showResizeHandle?: boolean;
  tags?: string[];
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  originalFile,
  pixelatedImage,
  defaultPreviewHeight = 350,
  showPixelGrid,
  showSaveButton = true,
  saveButtonPlacement = 'top',
  showEditButton = true,
  editButtonPlacement = 'top',
  showResizeHandle = false,
  tags = [],
}) => {
  const { t } = useTranslation('creator');
  const navigate = useNavigate();
  const hasCanvas = useEditorDataStore((s) => s.hasCanvas());
  const initializeFromPixelated = useEditorDataStore(
    (s) => s.initializeFromPixelated
  );
  const [processing, setProcessing] = useState(false);
  const pixelSize = useCreatorLocalStore((s) => s.pixelSize);
  const paletteName = useCreatorLocalStore((s) => s.paletteName);
  const [previewHeight, setPreviewHeight] =
    useState<number>(defaultPreviewHeight);
  const [imageNaturalSize, setImageNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleSaveImage = () => {
    if (!pixelatedImage || !originalFile) return;
    const link = document.createElement('a');
    link.download = originalFile.name;
    link.href = pixelatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = previewHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const next = Math.max(
        MIN_PREVIEW_HEIGHT,
        Math.min(MAX_PREVIEW_HEIGHT, startHeight + delta)
      );
      setPreviewHeight(next);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handlePreviewWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.shiftKey) return;
    const delta = e.deltaY > 0 ? -30 : 30;
    setPreviewHeight((h) =>
      Math.max(MIN_PREVIEW_HEIGHT, Math.min(MAX_PREVIEW_HEIGHT, h + delta))
    );
  };

  const handleEditImage = async () => {
    if (!pixelatedImage || !originalFile) return;
    const rows = Math.max(1, Math.ceil(imageNaturalSize.height / pixelSize));
    const columns = Math.max(1, Math.ceil(imageNaturalSize.width / pixelSize));
    if (rows > MAX_ROWS || columns > MAX_COLUMNS) {
      message.error(
        t('preview_panel.max_size_hint', {
          maxRows: MAX_ROWS,
          maxColumns: MAX_COLUMNS,
        })
      );
      return;
    }

    const proceed = async () => {
      try {
        setProcessing(true);
        const pixels = await parseDataUrlToGridPixels(
          pixelatedImage,
          rows,
          columns,
          pixelSize
        );
        initializeFromPixelated({
          rows,
          columns,
          filename: originalFile.name,
          pixelSize,
          paletteName,
          originalWidth: imageNaturalSize.width,
          originalHeight: imageNaturalSize.height,
          pixels,
        });
        navigate('../editor');
      } catch (err) {
        console.error(err);
        message.error('解析像素失败，请重试');
      } finally {
        setProcessing(false);
      }
    };

    if (hasCanvas) {
      Modal.confirm({
        title: t('preview_panel.overwrite_confirm_title'),
        content: t('preview_panel.overwrite_confirm_content'),
        okText: t('preview_panel.overwrite_confirm_ok'),
        cancelText: t('preview_panel.overwrite_confirm_cancel'),
        onOk: proceed,
      });
    } else {
      await proceed();
    }
  };

  // 获取图片原始尺寸
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  return (
    <>
      <GlobalLoadingOverlay visible={processing} />
      <div className={styles.previewCard} onWheel={handlePreviewWheel}>
        {pixelatedImage ? (
          <PixelGrid
            imageWidth={imageNaturalSize.width}
            imageHeight={imageNaturalSize.height}
            visible={showPixelGrid}
          >
            <Image
              className={styles.previewImage}
              src={pixelatedImage}
              style={{ height: previewHeight }}
              onLoad={handleImageLoad}
            />
          </PixelGrid>
        ) : (
          <div className={styles.emptyPreview}>
            {originalFile
              ? t('preview_panel.upload_after_hint')
              : t('preview_panel.upload_hint')}
          </div>
        )}

        {/* 底部高度调节句柄 */}
        {showResizeHandle && (
          <div
            className={styles.previewResizeHandle}
            onMouseDown={handleResizerMouseDown}
          />
        )}

        {showEditButton && editButtonPlacement === 'top' && (
          <Button
            title={t('preview_panel.edit_button')}
            className={styles.topEditButton}
            icon={<EditOutlined />}
            disabled={!pixelatedImage}
            onClick={handleEditImage}
          ></Button>
        )}

        {showSaveButton && saveButtonPlacement === 'top' && (
          <Button
            title={t('common.save_image')}
            className={styles.topSaveButton}
            icon={<DownloadOutlined />}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          ></Button>
        )}
        {/* Tags 标签 */}
        {tags?.length > 0 && (
          <div className={styles.tagsGroup}>
            {tags.map((tag, index) => (
              <Tag key={index} color={TAG_COLORS[index % TAG_COLORS.length]}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
      {showSaveButton && saveButtonPlacement === 'bottom' && (
        <Row className={styles.actionRow}>
          <Button
            title={t('common.save_image')}
            type="primary"
            className={styles.saveButton}
            disabled={!pixelatedImage}
            onClick={handleSaveImage}
          >
            {t('preview_panel.save_button')}
          </Button>
        </Row>
      )}
      {showEditButton && editButtonPlacement === 'bottom' && (
        <Row className={styles.actionRow}>
          <Button
            title={t('preview_panel.edit_button')}
            type="primary"
            className={styles.editButton}
            disabled={!pixelatedImage}
            onClick={handleEditImage}
          >
            {t('preview_panel.edit_button')}
          </Button>
        </Row>
      )}
    </>
  );
};

export default PreviewCard;
