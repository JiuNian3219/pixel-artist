import { useEffect, useRef, useState } from 'react';
import CenterSpin from '../CenterSpin';
import styles from './index.module.less';

interface CompareSliderProps {
  leftSrc: string;
  rightSrc: string;
  alt?: string;
}

/**
 * 含有滑块的对比图
 * @param params
 * @param params.leftSrc 左侧图片地址
 * @param params.rightSrc 右侧图片地址
 * @param params.alt 图片描述
 * @returns
 */
const CompareSlider: React.FC<CompareSliderProps> = ({
  leftSrc,
  rightSrc,
  alt,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dividerPercent, setDividerPercent] = useState<number>(50);
  const [dragging, setDragging] = useState<boolean>(false);
  const [leftLoaded, setLeftLoaded] = useState<boolean>(false);
  const [rightLoaded, setRightLoaded] = useState<boolean>(false);

  const clampPercent = (p: number) => Math.max(0, Math.min(100, p));

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setDividerPercent(clampPercent(percent));
  };

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      if (!dragging) return;
      updateFromClientX(ev.clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const onTouchMove = (ev: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const touch = ev.touches[0];
    updateFromClientX(touch.clientX);
  };

  const showLoading = !(leftLoaded && rightLoaded);

  return (
    <div
      ref={containerRef}
      className={styles.compareContainer}
      onMouseDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        const t = e.touches[0];
        updateFromClientX(t.clientX);
      }}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/** 左侧图 */}
      <img
        src={leftSrc}
        loading="lazy"
        alt={alt}
        className={styles.compareImage}
        onLoad={() => setLeftLoaded(true)}
      />
      {/** 右侧图 */}
      <img
        src={rightSrc}
        loading="lazy"
        alt={alt}
        className={styles.compareImage}
        style={{
          clipPath: `inset(0 0 0 ${dividerPercent}%)`,
          WebkitClipPath: `inset(0 0 0 ${dividerPercent}%)`,
        }}
        onLoad={() => setRightLoaded(true)}
      />

      {/** 中间拖动手柄 */}
      {!showLoading && (
        <div
          className={styles.handle}
          style={{ left: `${dividerPercent}%` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
        />
      )}

      {showLoading && (
        <div className={styles.loadingMask}>
          <CenterSpin />
        </div>
      )}
    </div>
  );
};

export default CompareSlider;
