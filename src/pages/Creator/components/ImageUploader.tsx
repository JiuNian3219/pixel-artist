import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, Progress, Upload, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../index.module.less";
import { isImageFile } from "../utils";

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
  const [previewUrl, setPreviewUrl] = useState<string>(originalImage || "");
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
        <div className={styles.preview}>
          {(!isEmpty(previewUrl) || uploading) && (
            <Image
              className={styles.previewImage}
              src={previewUrl}
              style={{
                filter: uploading ? "blur(2px) brightness(0.8)" : "none",
                transition: "filter 0.3s",
              }}
              fallback=""
            />
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
