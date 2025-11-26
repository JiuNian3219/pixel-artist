import type {
  EditorOperation,
  PrepareEditorFromPixelatedParams,
  Tool,
} from "@/types/editor";
import {
  DEFAULT_AUTO_COMPLETE,
  DEFAULT_COLOR,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_COLUMNS,
  DEFAULT_GRID_SIZE,
  DEFAULT_PENCIL_SIZE,
  DEFAULT_PIXEL_SIZE,
  DEFAULT_ROWS,
  DEFAULT_TOOL,
} from "@/utils/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Updater<T> = T | ((prev: T) => T);

interface EditorLocalStoreState {
  rows: number;
  columns: number;
  tool: Tool;
  color: string;
  pencilSize: number;
  pixelSize: number;
  autoComplete: boolean;
  originalWidth: number;
  originalHeight: number;
  filename?: string;
  paletteName: string;
  /** 像素缓存：只保存有颜色的格子，key 为 "x,y"，值为 hex 颜色 */
  pixels: Record<string, string>;
  /** 操作历史 */
  ops: Array<EditorOperation>;
  /** 指向最后一个已应用的操作索引，-1 表示没有已应用操作 */
  opIndex: number;
}

interface EditorLocalStoreActions {
  setRows: (rows: number) => void;
  setColumns: (columns: number) => void;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setPencilSize: (pencilSize: Updater<number>) => void;
  setPixelSize: (pixelSize: number) => void;
  setAutoComplete: (autoComplete: boolean) => void;
  setOriginalSize: (width: number, height: number) => void;
  setFilename: (name?: string) => void;
  setPaletteName: (name: string) => void;
  setPixels: (pixels: Record<string, string>) => void;
  updatePixels: (updater: Updater<Record<string, string>>) => void;
  setOps: (ops: Array<EditorOperation>) => void;
  setOpIndex: (index: number) => void;
  /** 提交一次操作（追加到历史，并将指针移动到末尾） */
  commitOp: (op: EditorOperation) => void;
  /** 撤销到上一步 */
  undo: () => void;
  /** 重做到下一步*/
  redo: () => void;
  /** 新建画布并重置相关编辑状态 */
  createCanvas: (rows: number, columns: number, filename?: string) => void;
  /** 从像素化结果初始化编辑器 */
  initializeFromPixelated: (p: PrepareEditorFromPixelatedParams) => void;
  hasCanvas: () => boolean;
}

export const useEditorStore = create<
  EditorLocalStoreState & EditorLocalStoreActions
>()(
  persist(
    (set, get) => ({
      rows: DEFAULT_ROWS,
      columns: DEFAULT_COLUMNS,
      tool: DEFAULT_TOOL,
      color: DEFAULT_COLOR,
      paletteName: DEFAULT_COLOR_PALETTE,
      gridSize: DEFAULT_GRID_SIZE,
      pencilSize: DEFAULT_PENCIL_SIZE,
      pixelSize: DEFAULT_PIXEL_SIZE,
      autoComplete: DEFAULT_AUTO_COMPLETE,
      originalWidth: 0,
      originalHeight: 0,
      pixels: {},
      ops: [],
      opIndex: -1,
      setTool: (tool) => set({ tool }),
      setColor: (color) => set({ color }),
      setPencilSize: (pencilSize) =>
        set((state) => ({
          pencilSize:
            typeof pencilSize === "function"
              ? pencilSize(state.pencilSize)
              : pencilSize,
        })),
      setRows: (rows) => set({ rows }),
      setColumns: (columns) => set({ columns }),
      setPixelSize: (pixelSize) => set({ pixelSize }),
      setAutoComplete: (autoComplete) => set({ autoComplete }),
      setOriginalSize: (width, height) =>
        set({ originalWidth: width, originalHeight: height }),
      setFilename: (name) => set({ filename: name }),
      setPaletteName: (name) => set({ paletteName: name }),
      setPixels: (pixels) => set({ pixels }),
      updatePixels: (updater) =>
        set((state) => ({
          pixels:
            typeof updater === "function" ? updater(state.pixels) : updater,
        })),
      setOps: (ops) => set({ ops }),
      setOpIndex: (index) => set({ opIndex: index }),
      commitOp: (op) =>
        set((state) => {
          if (!op || !op.changes || op.changes.length === 0) return state;
          const nextOps = state.ops.slice(0, state.opIndex + 1);
          nextOps.push(op);
          return { ops: nextOps, opIndex: nextOps.length - 1 };
        }),
      undo: () =>
        set((state) => {
          if (state.opIndex < 0) return state;
          const op = state.ops[state.opIndex];
          const nextPixels: Record<string, string> = { ...state.pixels };
          for (const c of op.changes) {
            const key = `${c.x},${c.y}`;
            if (c.prev == null) {
              delete nextPixels[key];
            } else {
              nextPixels[key] = c.prev;
            }
          }
          return { pixels: nextPixels, opIndex: state.opIndex - 1 };
        }),
      redo: () =>
        set((state) => {
          if (state.opIndex >= state.ops.length - 1) return state;
          const op = state.ops[state.opIndex + 1];
          const nextPixels: Record<string, string> = { ...state.pixels };
          for (const c of op.changes) {
            const key = `${c.x},${c.y}`;
            if (c.next == null) {
              delete nextPixels[key];
            } else {
              nextPixels[key] = c.next;
            }
          }
          return { pixels: nextPixels, opIndex: state.opIndex + 1 };
        }),
      createCanvas: (rows, columns, filename) =>
        set({
          rows,
          columns,
          filename,
          // 重置编辑相关状态为默认值
          pencilSize: DEFAULT_PENCIL_SIZE,
          pixelSize: DEFAULT_PIXEL_SIZE,
          autoComplete: DEFAULT_AUTO_COMPLETE,
          paletteName: DEFAULT_COLOR_PALETTE,
          color: DEFAULT_COLOR,
          originalWidth: 0,
          originalHeight: 0,
          pixels: {},
          ops: [],
          opIndex: -1,
        }),
      initializeFromPixelated: (p) =>
        set(() => ({
          rows: p.rows,
          columns: p.columns,
          filename: p.filename,
          pixelSize: p.pixelSize,
          paletteName: p.paletteName,
          originalWidth: p.originalWidth,
          originalHeight: p.originalHeight,
          pixels: p.pixels || {},
          // 清空编辑相关状态
          ops: [],
          opIndex: -1,
          color: DEFAULT_COLOR,
        })),
      hasCanvas: () => {
        const s = get();
        return s.rows > 0 && s.columns > 0;
      },
    }),
    {
      name: "editor-local-store",
      partialize: (state) => ({
        pixels: state.pixels,
        filename: state.filename,
        pixelSize: state.pixelSize,
        rows: state.rows,
        columns: state.columns,
        ops: state.ops,
        opIndex: state.opIndex,
        color: state.color,
        paletteName: state.paletteName,
      }),
    }
  )
);
