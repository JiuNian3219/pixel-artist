/**
 * 默认像素大小
 */
export const DEFAULT_PIXEL_SIZE = 16;
/**
 * 默认使用算法
 */
export const DEFAULT_ALGORITHM = "dominant";
/**
 * 默认颜色盘
 */
export const DEFAULT_COLOR_PALETTE = "All-Colors";
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
  ALGORITHM: "algorithm",
  PALETTE: "palette",
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
export const DEFAULT_THEME = "light";
