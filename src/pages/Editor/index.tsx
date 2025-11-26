import { useIsMobile } from "@/hooks/useIsMobile";
import { useEditorStore } from "@/stores/editorStore";
import { MAX_PENCIL_SIZE, MIN_PENCIL_SIZE, TOOLS } from "@/utils/constants";
import { Typography } from "antd";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.less";
import CanvasViewport, {
  type CanvasViewportHandle,
} from "./screen/CanvasViewport";
import ConfigsPanel from "./screen/ConfigsPanel";
import ToolsPanel from "./screen/ToolsPanel";

const Editor: React.FC = () => {
  const { t } = useTranslation("editor");
  const setTool = useEditorStore((s) => s.setTool);
  const setPencilSize = useEditorStore((s) => s.setPencilSize);
  const hasCanvas = useEditorStore((s) => s.hasCanvas());
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canvasRef = useRef<CanvasViewportHandle | null>(null);
  const isMobile = useIsMobile();

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        canvasRef.current?.exportImage();
      }
      // 撤销/重做
      else if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      // 切换工具
      else if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        setTool(TOOLS.PENCIL);
      } else if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        setTool(TOOLS.ERASER);
      } else if (e.key.toLowerCase() === "g") {
        e.preventDefault();
        setTool(TOOLS.FILL);
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        setTool(TOOLS.PICKER);
      } else if (e.key.toLowerCase() === "v") {
        e.preventDefault();
        setTool(TOOLS.DRAG);
      }
      // 画笔缩放
      else if (e.key === "]" || e.key === "】") {
        e.preventDefault();
        setPencilSize((prev) => Math.min(MAX_PENCIL_SIZE, prev + 1));
      } else if (e.key === "[" || e.key === "【") {
        e.preventDefault();
        setPencilSize((prev) => Math.max(MIN_PENCIL_SIZE, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.editorContainer}>
      {/** 移动端工具栏位于 画布 下方 */}
      {!isMobile && (
        <div className={styles.toolsContainer}>
          <ToolsPanel />
        </div>
      )}
      <div className={styles.CanvasWrapper}>
        {hasCanvas ? (
          <CanvasViewport ref={canvasRef} />
        ) : (
          <div className={styles.emptyContainer}>
            <Typography.Title level={4}>
              {t("common.empty.title")}
            </Typography.Title>
            <Typography.Paragraph>
              {t("common.empty.hint")}
            </Typography.Paragraph>
          </div>
        )}
      </div>
      {isMobile && (
        <div className={styles.toolsContainer}>
          <ToolsPanel />
        </div>
      )}
      <div className={styles.configContainer}>
        <ConfigsPanel onExport={() => canvasRef.current?.exportImage()} />
      </div>

      {/** 操作提示 */}
      {!isMobile && (
        <Typography.Text className={styles.operationHint}>
          {t("common.operation_hint")}
        </Typography.Text>
      )}
    </div>
  );
};

export default Editor;
