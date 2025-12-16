import CenterSpin from '@/components/CenterSpin';
import { ClientOnly } from '@/components/ClientOnly';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePageContext } from '@/renderer/usePageContext';
import { useEditorDataStore, useEditorUIStore } from '@/stores';
import { MAX_PENCIL_SIZE, MIN_PENCIL_SIZE, TOOLS } from '@/utils/constants';
import { parseLocaleFromPath, withLocalePath } from '@/utils/locale';
import { Button, Result, Spin, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'vike/client/router';
import styles from './index.module.less';
import CanvasViewport, {
  type CanvasViewportHandle,
} from './screen/CanvasViewport';
import ConfigsPanel from './screen/ConfigsPanel';
import ToolsPanel from './screen/ToolsPanel';

const Editor: React.FC = () => {
  const { t } = useTranslation('editor');
  const pageContext = usePageContext();
  const locale = parseLocaleFromPath(pageContext.urlPathname);
  const setTool = useEditorUIStore((s) => s.setTool);
  const setPencilSize = useEditorUIStore((s) => s.setPencilSize);
  const hasCanvas = useEditorDataStore((s) => s.hasCanvas());
  const isLoading = useEditorDataStore((s) => s.isLoading);
  const undo = useEditorDataStore((s) => s.undo);
  const redo = useEditorDataStore((s) => s.redo);
  const triggerSave = useEditorDataStore((s) => s.triggerSave);
  const canvasRef = useRef<CanvasViewportHandle | null>(null);
  const isMobile = useIsMobile();

  const goToCreator = () => {
    navigate(withLocalePath(locale, '/creator'));
  };

  const goToHome = () => {
    navigate(withLocalePath(locale, '/'));
  };

  // 确保页面关闭前保存数据
  useEffect(() => {
    const handleBeforeUnload = () => {
      triggerSave();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [triggerSave]);

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        canvasRef.current?.exportImage();
      }
      // 撤销/重做
      else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      // 切换工具
      else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setTool(TOOLS.PENCIL);
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setTool(TOOLS.ERASER);
      } else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setTool(TOOLS.FILL);
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setTool(TOOLS.PICKER);
      } else if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setTool(TOOLS.DRAG);
      }
      // 画笔缩放
      else if (e.key === ']' || e.key === '】') {
        e.preventDefault();
        setPencilSize((prev) => Math.min(MAX_PENCIL_SIZE, prev + 1));
      } else if (e.key === '[' || e.key === '【') {
        e.preventDefault();
        setPencilSize((prev) => Math.max(MIN_PENCIL_SIZE, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ClientOnly fallback={<CenterSpin style={{ height: '100vh' }} />}>
      {isMobile ? (
        <div className={styles.mobileNotSupportedContainer}>
          <Result
            status="info"
            title={t('mobile_not_supported.title')}
            subTitle={t('mobile_not_supported.description')}
            extra={[
              <Button type="primary" key="home" onClick={goToHome}>
                {t('mobile_not_supported.back_home')}
              </Button>,
              <Button key="creator" onClick={goToCreator}>
                {t('mobile_not_supported.go_creator')}
              </Button>,
            ]}
          />
        </div>
      ) : (
        <div className={styles.editorContainer}>
          <div className={styles.toolsContainer}>
            <ToolsPanel onResetView={() => canvasRef.current?.resetView()} />
          </div>
          <div className={styles.CanvasWrapper}>
            {isLoading ? (
              <div className={styles.emptyContainer}>
                <Spin />
              </div>
            ) : hasCanvas ? (
              <CanvasViewport ref={canvasRef} />
            ) : (
              <div className={styles.emptyContainer}>
                <Typography.Title level={4}>
                  {t('common.empty.title')}
                </Typography.Title>
                <Typography.Paragraph type="secondary">
                  {t('common.empty.hint')}
                </Typography.Paragraph>
              </div>
            )}
          </div>

          <div className={styles.configContainer}>
            <ConfigsPanel onExport={() => canvasRef.current?.exportImage()} />
          </div>

          {/** 操作提示 */}
          <Typography.Text className={styles.operationHint}>
            {t('common.operation_hint')}
          </Typography.Text>
        </div>
      )}
    </ClientOnly>
  );
};

export default Editor;
