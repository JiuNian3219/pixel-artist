import { useEditorStore } from "@/stores/editorStore";
import { TOOLS } from "@/utils/constants";
import { Button, ColorPicker } from "antd";
import type { Color } from "antd/es/color-picker";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../index.module.less";

const ToolsPanel: React.FC = () => {
  const { t } = useTranslation("editor");
  const tool = useEditorStore((s) => s.tool);
  const color = useEditorStore((s) => s.color);
  const setTool = useEditorStore((s) => s.setTool);
  const setColor = useEditorStore((s) => s.setColor);
  const opIndex = useEditorStore((s) => s.opIndex);
  const opsLen = useEditorStore((s) => s.ops.length);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = (colorObj: Color) => {
    setLocalColor(colorObj.toHexString());
  };

  const handleColorChangeComplete = (colorObj: Color) => {
    setColor(colorObj.toHexString());
  };

  return (
    <div className={styles.toolsPanel}>
      <Button
        className={styles.toolButton}
        type={tool === TOOLS.PENCIL ? "primary" : "default"}
        icon={<span className="iconfont icon-huabi_huaban1"></span>}
        onClick={() => setTool(TOOLS.PENCIL)}
        title={t("tools_panel.pencil")}
      />
      <Button
        className={styles.toolButton}
        type={tool === TOOLS.ERASER ? "primary" : "default"}
        icon={<span className="iconfont icon-xiangpi_huaban1"></span>}
        onClick={() => setTool(TOOLS.ERASER)}
        title={t("tools_panel.eraser")}
      />
      <Button
        className={styles.toolButton}
        type={tool === TOOLS.FILL ? "primary" : "default"}
        icon={<span className="iconfont icon-youqitong_huaban1"></span>}
        onClick={() => setTool(TOOLS.FILL)}
        title={t("tools_panel.fill")}
      />
      <Button
        className={styles.toolButton}
        type={tool === TOOLS.PICKER ? "primary" : "default"}
        icon={<span className="iconfont icon-xiguan_huaban1"></span>}
        onClick={() => setTool(TOOLS.PICKER)}
        title={t("tools_panel.picker")}
      />
      <Button
        className={styles.toolButton}
        type={tool === TOOLS.DRAG ? "primary" : "default"}
        icon={<span className="iconfont icon-yidong_huaban1"></span>}
        onClick={() => setTool(TOOLS.DRAG)}
        title={t("tools_panel.drag")}
      />

      <ColorPicker
        value={localColor}
        disabledAlpha
        onChange={handleColorChange}
        onChangeComplete={handleColorChangeComplete}
      />

      <Button
        className={styles.toolButton}
        icon={<span className="iconfont icon-houtui"></span>}
        title={t("tools_panel.back")}
        disabled={opIndex < 0}
        onClick={undo}
      />

      <Button
        className={styles.toolButton}
        icon={<span className="iconfont icon-qianjin"></span>}
        title={t("tools_panel.next")}
        disabled={opIndex >= opsLen - 1}
        onClick={redo}
      />
    </div>
  );
};

export default ToolsPanel;
