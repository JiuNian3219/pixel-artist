// 编辑器工具类型 包含 铅笔、橡皮擦、桶、吸管、拖动
export type Tool = 'pencil' | 'eraser' | 'fill' | 'picker' | 'drag';

// 编辑器中的点坐标类型
export type Point = { x: number; y: number };

// 编辑器一次操作中单个像素的变更
export type OperationChange = {
  x: number;
  y: number;
  prev: string | null;
  next: string | null;
};

// 编辑器一次操作
export type EditorOperation = {
  changes: OperationChange[];
};

// 从像素化结果初始化编辑器的参数
export interface PrepareEditorFromPixelatedParams {
  rows: number;
  columns: number;
  filename?: string;
  pixelSize: number;
  paletteName: string;
  originalWidth: number;
  originalHeight: number;
  pixels: Record<string, string>;
}
