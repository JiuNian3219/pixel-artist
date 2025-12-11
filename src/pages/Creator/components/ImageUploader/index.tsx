import { useIsMobile } from '@/hooks/useIsMobile';
import { useCreatorLocalStore } from '@/stores';
import { MAX_PREVIEW_HEIGHT, MIN_PREVIEW_HEIGHT } from '@/utils/constants';
import {
  BorderOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Image, Progress, Upload, message } from 'antd';
import lodash from 'lodash';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isImageFile } from '../../utils';
import PixelGrid from '../PixelGrid';
import styles from './index.module.less';

const { Dragger } = Upload;
const { isEmpty } = lodash;

interface ImageUploaderProps {
  onImageChange: (file: File | null, originalImage: string) => void;
  mode?: 'dragger' | 'button';
  disabled?: boolean;
  originalImage?: string;
}

const baseUploadProps = {
  maxCount: 1,
  accept: '.jpg,.jpeg,.png,.webp',
  showUploadList: false,
};

/**
 * 图片上传器
 * @param params 上传参数
 * @param onImageChange 图片上传成功回调
 * @param mode 上传模式 dragger 拖拽上传 button 点击上传
 * @param originalImage 原始图片
 * @returns
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  mode = 'dragger',
  disabled = false,
  originalImage,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewHeight, setPreviewHeight] = useState<number>(350);
  const [imageNaturalSize, setImageNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const showControlPixelGrid = useCreatorLocalStore(
    (state) => state.showControlPixelGrid
  );
  const setShowControlPixelGrid = useCreatorLocalStore(
    (state) => state.setShowControlPixelGrid
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(originalImage || '');
  const isMobile = useIsMobile();
  const { t } = useTranslation('creator');
  const customRequest = ({ file, onSuccess, onProgress }: any) => {
    if (disabled) {
      message.warning(t('common.pixelation_in_progress'));
      return;
    }
    const rawFile = file as File;
    if (!isImageFile(rawFile)) {
      message.error(t('image_uploader.type_error_message'));
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    // 创建文件流
    const reader = new FileReader();

    // 监听读取进度
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        if (onProgress) {
          onProgress({ percent });
        }
      }
    };

    // 读取完成
    reader.onload = (e) => {
      // 由于读取太快，延迟一下，让加载效果更好
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(100);
        if (e.target && e.target.result) {
          const result = e.target.result as string;
          setPreviewUrl(result);
          onImageChange(rawFile, result);
        }
        onSuccess?.();
      }, 500);
    };

    // 读取错误
    reader.onerror = () => {
      setUploading(false);
      message.error(
        t('image_uploader.upload_failed_message', { name: rawFile.name })
      );
    };

    // 读取文件
    reader.readAsDataURL(rawFile);
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

  const togglePixelGrid = () => {
    setShowControlPixelGrid(!showControlPixelGrid);
  };

  // 获取图片原始尺寸
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  return (
    <>
      {mode === 'dragger' && (
        <Dragger {...baseUploadProps} customRequest={customRequest}>
          <div className={styles.uploadDragger}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('image_uploader.hint')}</p>
            <p className="ant-upload-hint">{t('image_uploader.tip')}</p>
          </div>
        </Dragger>
      )}

      {mode === 'button' && (
        <Upload {...baseUploadProps} customRequest={customRequest}>
          <Button
            title={t('image_uploader.title')}
            shape="circle"
            type="dashed"
            icon={<UploadOutlined />}
            disabled={disabled}
            className={styles.uploadButton}
          ></Button>
        </Upload>
      )}

      {mode === 'dragger' && (
        <div className={styles.preview} ref={previewRef}>
          {!isEmpty(previewUrl) && (
            <PixelGrid
              imageWidth={imageNaturalSize.width}
              imageHeight={imageNaturalSize.height}
              visible={showControlPixelGrid}
            >
              <Image
                className={styles.previewImage}
                src={previewUrl}
                height={previewHeight}
                onLoad={handleImageLoad}
              />
              <Button
                title={t('common.show_pixel_grid')}
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showControlPixelGrid ? 'primary' : 'default'}
                size="small"
                className={styles.previewGridButton}
              />
              {!isMobile && (
                <div
                  className={styles.previewResizeHandle}
                  onMouseDown={handleResizerMouseDown}
                />
              )}
            </PixelGrid>
          )}
          {uploading && (
            <>
              <div
                className={styles.uploadingPreview}
                style={{
                  height: previewHeight,
                }}
              ></div>
              <Progress
                percent={uploadProgress}
                status="active"
                className={styles.uploadProgress}
                showInfo={false}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUploader;
