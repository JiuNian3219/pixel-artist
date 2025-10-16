import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import {
  BorderOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Image, Progress, Upload, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../index.module.less";
import { isImageFile } from "../utils";
import PixelGrid from "./PixelGrid";

interface ImageUploaderProps {
  onImageChange: (file: File | null, originalImage: string) => void;
  mode?: "dragger" | "button";
  originalImage?: string;
}

const baseUploadProps = {
  maxCount: 1,
  accept: ".jpg,.jpeg,.png,.webp",
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
  mode = "dragger",
  originalImage,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewHeight, setPreviewHeight] = useState<number>(350);
  const [imageNaturalSize, setImageNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState<{
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
  const [previewUrl, setPreviewUrl] = useState<string>(originalImage || "");
  const isMobile = useIsMobile();
  const { t } = useTranslation("creator");
  const customRequest = ({ file, onSuccess, onProgress }: any) => {
    const rawFile = file as File;
    if (!isImageFile(rawFile)) {
      message.error(t("image_uploader.type_error_message"));
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
        t("image_uploader.upload_failed_message", { name: rawFile.name })
      );
    };

    // 读取文件
    reader.readAsDataURL(rawFile);
  };

  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = previewHeight;
    const minHeight = 250;
    const maxHeight = 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const next = Math.max(
        minHeight,
        Math.min(maxHeight, startHeight + delta)
      );
      setPreviewHeight(next);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const togglePixelGrid = () => {
    setShowControlPixelGrid(!showControlPixelGrid);
  };

  // 监听容器尺寸变化
  useEffect(() => {
    if (!previewRef.current) return;

    const updateContainerSize = () => {
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [previewHeight, previewUrl]);

  // 获取图片原始尺寸
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    // 图片加载完成后，确保容器尺寸及时更新
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  };

  return (
    <>
      {mode === "dragger" && (
        <Dragger
          {...baseUploadProps}
          customRequest={customRequest}
        >
          <div className={styles.uploadDragger}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined className={styles.uploadIcon} />
            </p>
            <p className="ant-upload-text">{t("image_uploader.hint")}</p>
            <p className="ant-upload-hint">{t("image_uploader.tip")}</p>
          </div>
        </Dragger>
      )}

      {mode === "button" && (
        <Upload
          {...baseUploadProps}
          customRequest={customRequest}
        >
          <Button
            shape="circle"
            type="dashed"
            icon={<UploadOutlined />}
            className={styles.uploadButton}
          ></Button>
        </Upload>
      )}

      {mode === "dragger" && (
        <div
          className={styles.preview}
          ref={previewRef}
        >
          {(!isEmpty(previewUrl) || uploading) && (
            <>
              <Image
                className={styles.previewImage}
                src={previewUrl}
                style={{
                  filter: uploading ? "blur(2px) brightness(0.8)" : "none",
                  transition: "filter 0.3s",
                  height: previewHeight,
                }}
                onLoad={handleImageLoad}
                fallback=""
              />
              <Button
                onClick={togglePixelGrid}
                icon={<BorderOutlined />}
                type={showControlPixelGrid ? "primary" : "default"}
                size="small"
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  zIndex: 20,
                }}
              />
              {/* 网格覆盖层 */}
              <PixelGrid
                imageWidth={imageNaturalSize.width}
                imageHeight={imageNaturalSize.height}
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
                visible={showControlPixelGrid}
              />
              {!isMobile && (
                <div
                  className={styles.previewResizeHandle}
                  onMouseDown={handleResizerMouseDown}
                />
              )}
            </>
          )}
          {uploading && (
            <Progress
              percent={uploadProgress}
              status="active"
              className={styles.uploadProgress}
              showInfo={false}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ImageUploader;
