import { useIsMobile } from '@/hooks/useIsMobile';
import { useCreatorLocalStore } from '@/stores';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import ControlPanel from './screen/ControlPanel';
import PreviewPanel from './screen/PreviewPanel';

const Creator: React.FC = () => {
  const extendMode = useCreatorLocalStore((state) => state.extendMode);
  const setExtendMode = useCreatorLocalStore((state) => state.setExtendMode);
  const isMobile = useIsMobile();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pixelatedResults, setPixelatedResults] = useState<
    { url: string; algorithm: string; palette: string }[]
  >([]);

  const layoutStyle = useMemo(() => {
    return {
      '--preview-flex': extendMode ? '1' : '0.65',
      '--control-flex': extendMode ? '' : '0.35',
      flexDirection: isMobile ? 'column-reverse' : 'row',
    } as React.CSSProperties;
  }, [extendMode, isMobile]);

  useEffect(() => {
    if (isMobile && extendMode) {
      setExtendMode(false);
    }
  }, [isMobile, extendMode]);

  return (
    <div className={styles.container}>
      <div className={styles.unifiedLayout} style={layoutStyle}>
        <div className={styles.previewArea}>
          <PreviewPanel
            originalFile={originalFile}
            pixelatedResults={pixelatedResults}
            setPixelatedResults={setPixelatedResults}
          />
        </div>
        <div className={styles.controlArea}>
          <ControlPanel
            setOriginalFile={setOriginalFile}
            setPixelatedResults={setPixelatedResults}
          />
        </div>
      </div>
    </div>
  );
};

export default Creator;
