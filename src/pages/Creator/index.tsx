import { useIsMobile } from "@/hooks/useIsMobile";
import { useCreatorLocalStore } from "@/stores";
import React, { useMemo, useState } from "react";
import styles from "./index.module.less";
import ControlPanel from "./screen/ControlPanel";
import PreviewPanel from "./screen/PreviewPanel";

const Creator: React.FC = () => {
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const isMobile = useIsMobile();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pixelatedImage, setPixelatedImage] = useState<string>("");

  const layoutStyle = useMemo(() => {
    return {
      "--preview-flex": extendMode ? "1" : "0.65",
      "--control-flex": extendMode ? "" : "0.35",
      flexDirection: isMobile ? "column-reverse" : "row",
    } as React.CSSProperties;
  }, [extendMode, isMobile]);

  return (
    <div className={styles.container}>
      <div
        className={styles.unifiedLayout}
        style={layoutStyle}
      >
        <div className={styles.previewArea}>
          <PreviewPanel
            originalFile={originalFile}
            pixelatedImage={pixelatedImage}
          />
        </div>
        <div className={styles.controlArea}>
          <ControlPanel
            setOriginalFile={setOriginalFile}
            setPixelatedImage={setPixelatedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Creator;
