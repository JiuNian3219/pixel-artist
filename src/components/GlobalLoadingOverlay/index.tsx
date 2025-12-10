import { Spin, Typography } from 'antd';
import React from 'react';
import styles from './index.module.less';

interface GlobalLoadingOverlayProps {
  visible: boolean;
  text?: string;
}

/**
 * 全屏遮罩加载组件：以固定层覆盖整个页面并居中显示 Spin
 * @param visible 是否显示加载遮罩
 * @param text 加载提示文案
 */
const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  visible,
  text,
}) => {
  return (
    <div className={visible ? styles.overlayRoot : styles.hidden}>
      <div className={styles.content}>
        <Spin size="large" />
        {text && (
          <Typography.Text className={styles.tipText}>{text}</Typography.Text>
        )}
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
