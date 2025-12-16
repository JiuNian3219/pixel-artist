import type { Tool } from '@/types/editor';

/**
 * 默认像素大小
 */
export const DEFAULT_PIXEL_SIZE = 16;
/**
 * 默认是否自动补全（不截取边缘）
 */
export const DEFAULT_AUTO_COMPLETE = false;
/**
 * 默认使用算法
 */
export const DEFAULT_ALGORITHM = 'dominant';
/**
 * 默认颜色盘
 */
export const DEFAULT_COLOR_PALETTE = 'All-Colors';
/**
 * 默认是否开启扩展模式
 */
export const DEFAULT_EXTEND_MODE = false;
/**
 * 默认是否开启控制像素网格
 */
export const DEFAULT_SHOW_CONTROL_PIXEL_GRID = false;
/**
 * 默认是否开启预览像素网格
 */
export const DEFAULT_SHOW_PREVIEW_PIXEL_GRID = false;
/**
 * 默认是否开启多方案生成
 */
export const DEFAULT_MULTI_ALGORITHM_ENABLED = false;
/**
 * 预览面板列数
 */
export const PREVIEW_COLUMNS = [1, 2, 3] as const;
/**
 * 预览面板默认列数
 */
export const DEFAULT_PREVIEW_COLUMNS = 1;
/**
 * 默认多方案选择的算法集合
 */
export const DEFAULT_SELECTED_ALGORITHMS: string[] = [];
/**
 * 默认多方案选择的调色板集合
 */
export const DEFAULT_SELECTED_PALETTES: string[] = [];
/**
 * 批任务排列因子
 */
export const TASK_FACTORS = {
  ALGORITHM: 'algorithm',
  PALETTE: 'palette',
} as const;
/**
 * 默认批任务排列因子顺序
 */
export const DEFAULT_TASK_FACTORS_ORDER = [
  TASK_FACTORS.PALETTE,
  TASK_FACTORS.ALGORITHM,
] as const;
/**
 * 默认预览面板最小高度
 */
export const MIN_PREVIEW_HEIGHT = 250;
/**
 * 默认预览面板最大高度
 */
export const MAX_PREVIEW_HEIGHT = 800;
/**
 * 默认预览面板初始高度（px）
 */
export const DEFAULT_PREVIEW_HEIGHT = 350;
/**
 * 最大像素尺寸
 */
export const MAX_PIXEL_SIZE = 128;
/**
 *  最小像素尺寸
 */
export const MIN_PIXEL_SIZE = 1;
/**
 * 默认主题
 */
export const DEFAULT_THEME = 'light';
/**
 * 编辑工具
 */
export const TOOLS = {
  PENCIL: 'pencil',
  ERASER: 'eraser',
  FILL: 'fill',
  PICKER: 'picker',
  DRAG: 'drag',
} as const satisfies Record<string, Tool>;
/**
 * 默认编辑工具
 */
export const DEFAULT_TOOL: Tool = 'pencil';
/**
 * 默认编辑颜色
 */
export const DEFAULT_COLOR = '#000000';
/**
 * 默认笔刷大小
 */
export const DEFAULT_PENCIL_SIZE = 1;
/**
 * 最小笔刷大小
 */
export const MIN_PENCIL_SIZE = 1;
/**
 * 最大笔刷大小
 */
export const MAX_PENCIL_SIZE = 32;
/**
 * 默认网格大小
 */
export const DEFAULT_GRID_SIZE = 4;
/**
 * 初始行
 */
export const INITIAL_ROWS = 0;
/**
 * 初始列
 */
export const INITIAL_COLUMNS = 0;
/**
 * 默认创建行
 */
export const DEFAULT_ROWS = 32;
/**
 * 默认创建列
 */
export const DEFAULT_COLUMNS = 32;
/**
 * 最大行
 */
export const MAX_ROWS = 1024;
/**
 * 最大列
 */
export const MAX_COLUMNS = 1024;
/**
 * 最小行
 */
export const MIN_ROWS = 1;
/**
 * 最小列
 */
export const MIN_COLUMNS = 1;
/**
 * 最小的缩放比例
 */
export const MIN_ZOOM = 0.1;
/**
 * 默认缩放比例
 */
export const DEFAULT_ZOOM = 1.0;
/**
 * 默认缩放比例范围
 */
export const DEFAULT_ZOOM_LIMITS = {
  min: 1.0,
  max: 16.0,
};
/**
 * 默认偏移量
 */
export const DEFAULT_TRANSLATION = {
  x: 0,
  y: 0,
};
/**
 * 默认导出像素大小
 */
export const DEFAULT_EXPORT_PIXEL_SIZE = 16;
/**
 * 默认是否拾色器工具吸取颜色后切换到画笔工具
 */
export const DEFAULT_PICKER_SWITCH_TO_PENCIL = true;
/**
 * 默认导出文件名
 */
export const DEFAULT_FILENAME = 'pixel-art';
