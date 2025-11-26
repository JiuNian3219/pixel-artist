import { useEditorStore } from "@/stores/editorStore";
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  MAX_COLUMNS,
  MAX_PENCIL_SIZE,
  MAX_ROWS,
  MIN_COLUMNS,
  MIN_PENCIL_SIZE,
  MIN_ROWS,
} from "@/utils/constants";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Slider,
  Space,
  Tooltip,
  Typography,
} from "antd";
import type { CheckboxChangeEvent } from "antd/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PaletteSelector from "../components/PaletteSelector";
import styles from "../index.module.less";

interface ConfigsPanelProps {
  onExport: () => void;
}

const ConfigsPanel: React.FC<ConfigsPanelProps> = ({ onExport }) => {
  const { t } = useTranslation("editor");
  const rows = useEditorStore((s) => s.rows);
  const columns = useEditorStore((s) => s.columns);
  const autoComplete = useEditorStore((s) => s.autoComplete);
  const setAutoComplete = useEditorStore((s) => s.setAutoComplete);
  const paletteName = useEditorStore((s) => s.paletteName);
  const setPaletteName = useEditorStore((s) => s.setPaletteName);
  const pencilSize = useEditorStore((s) => s.pencilSize);
  const setPencilSize = useEditorStore((s) => s.setPencilSize);
  const hasCanvas = useEditorStore((s) => s.hasCanvas());
  const createCanvas = useEditorStore((s) => s.createCanvas);
  const clearCanvas = useEditorStore((s) => s.clearCanvas);
  const pickerSwitchToPencil = useEditorStore((s) => s.pickerSwitchToPencil);
  const setPickerSwitchToPencil = useEditorStore(
    (s) => s.setPickerSwitchToPencil
  );

  const [showSetup, setShowSetup] = useState(false);
  const [form] = Form.useForm<{
    rows: number;
    columns: number;
    filename?: string;
  }>();

  const openCreateCanvasModal = () => {
    form.setFieldsValue({
      rows: DEFAULT_ROWS,
      columns: DEFAULT_COLUMNS,
      filename: "",
    });
    setShowSetup(true);
  };

  const closeCreateCanvasModal = () => {
    setShowSetup(false);
  };

  const handleCreateCanvas = (values: {
    rows: number;
    columns: number;
    filename?: string;
  }) => {
    const r = Math.max(MIN_ROWS, values.rows || MIN_ROWS);
    const c = Math.max(MIN_COLUMNS, values.columns || MIN_COLUMNS);
    createCanvas(r, c, values.filename || undefined);
    setShowSetup(false);
    form.resetFields();
  };

  const handlePaletteChange = (value: string) => {
    setPaletteName(value);
  };

  const toggleAutoComplete = (e: CheckboxChangeEvent) => {
    setAutoComplete(e.target.checked);
  };

  const togglePickerSwitchToPencil = (e: CheckboxChangeEvent) => {
    setPickerSwitchToPencil(e.target.checked);
  };

  const handleClearCanvas = () => {
    Modal.confirm({
      title: t("configs_panel.clear_modal.title"),
      content: t("configs_panel.clear_modal.content"),
      okText: t("configs_panel.clear_modal.ok_text"),
      okType: "danger",
      cancelText: t("configs_panel.clear_modal.cancel_text"),
      onOk: clearCanvas,
    });
  };

  return (
    <div className={styles.configsPanel}>
      <Button
        type="primary"
        onClick={openCreateCanvasModal}
        className={styles.createButton}
      >
        {t("configs_panel.create_button")}
      </Button>

      {/* 画布尺寸 */}
      <Flex
        justify="space-between"
        align="center"
        className={styles.configBase}
      >
        <Typography.Title
          level={5}
          style={{ margin: 0 }}
        >
          {t("configs_panel.canvas_size")}
        </Typography.Title>
        <Typography.Text strong>
          {rows || 0} × {columns || 0}
        </Typography.Text>
      </Flex>

      {/* 笔刷大小 */}
      <Flex
        justify="space-between"
        align="center"
        className={styles.configBase}
      >
        <Typography.Title
          level={5}
          style={{ margin: 0 }}
        >
          {t("configs_panel.pencil_size")}
        </Typography.Title>
        <Typography.Text strong>{pencilSize}</Typography.Text>
      </Flex>
      <div className={styles.configBase}>
        <Slider
          min={MIN_PENCIL_SIZE}
          max={MAX_PENCIL_SIZE}
          value={pencilSize}
          onChange={(v) => setPencilSize(v)}
        />
      </div>

      {/* 调色板 */}
      <PaletteSelector
        value={paletteName}
        onChange={handlePaletteChange}
      />

      <Typography.Title
        level={5}
        style={{ margin: 0 }}
      >
        {t("configs_panel.painting_config")}
      </Typography.Title>
      {/* 拾色切换 */}
      <Space>
        <Checkbox
          checked={pickerSwitchToPencil}
          onChange={togglePickerSwitchToPencil}
        >
          {t("configs_panel.picker_switch_to_pencil")}
        </Checkbox>
        <Tooltip title={t("configs_panel.picker_switch_to_pencil_tooltip")}>
          <QuestionCircleOutlined />
        </Tooltip>
      </Space>

      <Typography.Title
        level={5}
        style={{ margin: 0 }}
      >
        {t("configs_panel.export_config")}
      </Typography.Title>
      {/** 导出时自动填充画布边缘 */}
      <Space>
        <Checkbox
          checked={autoComplete}
          onChange={toggleAutoComplete}
        >
          {t("configs_panel.auto_complete")}
        </Checkbox>
        <Tooltip title={t("configs_panel.auto_complete_tooltip")}>
          <QuestionCircleOutlined />
        </Tooltip>
      </Space>

      <Button
        type="primary"
        onClick={onExport}
        disabled={!onExport || !hasCanvas}
        className={styles.saveButton}
      >
        {t("configs_panel.save_button")}
      </Button>
      <div className={styles.clearButtonContainer}>
        <Button
          danger
          onClick={handleClearCanvas}
          disabled={!hasCanvas}
          className={styles.clearButton}
        >
          {t("configs_panel.clear_button")}
        </Button>
      </div>

      <Modal
        open={showSetup}
        title={t("configs_panel.create_model.title")}
        okText={t("configs_panel.create_model.create_button")}
        cancelText={t("configs_panel.create_model.cancel_button")}
        onOk={() => form.submit()}
        onCancel={() => {
          closeCreateCanvasModal();
          form.resetFields();
        }}
      >
        <Form
          form={form}
          onFinish={handleCreateCanvas}
        >
          <Form.Item
            label={t("configs_panel.create_model.rows_and_columns")}
            required
          >
            <Space align="center">
              <Form.Item
                name="rows"
                rules={[
                  {
                    required: true,
                    message: t("configs_panel.create_model.rows_required"),
                  },
                  {
                    type: "number",
                    min: MIN_ROWS,
                    message: t("configs_panel.create_model.rows_min", {
                      min: MIN_ROWS,
                    }),
                  },
                  {
                    type: "number",
                    max: MAX_ROWS,
                    message: t("configs_panel.create_model.rows_max", {
                      max: MAX_ROWS,
                    }),
                  },
                ]}
                className={styles.rowsInput}
              >
                <InputNumber
                  min={MIN_ROWS}
                  className={styles.numberInput}
                />
              </Form.Item>
              <span>x</span>
              <Form.Item
                name="columns"
                rules={[
                  {
                    required: true,
                    message: t("configs_panel.create_model.columns_required"),
                  },
                  {
                    type: "number",
                    min: MIN_COLUMNS,
                    message: t("configs_panel.create_model.columns_min", {
                      min: MIN_COLUMNS,
                    }),
                  },
                  {
                    type: "number",
                    max: MAX_COLUMNS,
                    message: t("configs_panel.create_model.columns_max", {
                      max: MAX_COLUMNS,
                    }),
                  },
                ]}
                className={styles.rowsInput}
              >
                <InputNumber
                  min={MIN_COLUMNS}
                  className={styles.numberInput}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item
            label={t("configs_panel.create_model.filename")}
            name="filename"
          >
            <Input
              placeholder={t("configs_panel.create_model.filename_placeholder")}
            />
          </Form.Item>
          {hasCanvas ? (
            <Typography.Text type="warning">
              {t("configs_panel.create_model.warning")}
            </Typography.Text>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default ConfigsPanel;
