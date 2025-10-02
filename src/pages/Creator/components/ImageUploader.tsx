import { InboxOutlined } from "@ant-design/icons";
import { Image, Progress, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../index.module.less";
import { isImageFile } from "../utils";

interface ImageUploaderProps {
  onImageChange: (file: File | null, previewUrl: string) => void;
}

/**
 * 图片上传器
 * @param params 上传参数
 * @param onImageChange 图片上传成功回调
 * @returns
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string>("");
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
      <Dragger
        maxCount={1}
        accept=".jpg,.jpeg,.png,.webp"
        showUploadList={false}
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
    </>
  );
};

export default ImageUploader;
