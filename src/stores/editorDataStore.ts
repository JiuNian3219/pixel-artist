import type {
  EditorOperation,
  PrepareEditorFromPixelatedParams,
} from '@/types/editor';
import { INITIAL_COLUMNS, INITIAL_ROWS } from '@/utils/constants';
import { del, get, set as setIDB } from 'idb-keyval';
import lodash from 'lodash';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const { debounce } = lodash;

export const runtimePixels = new Map<string, string>();
const PIXELS_STORAGE_KEY = 'editor-pixel-data';

export type Updater<T> = T | ((prev: T) => T);

interface EditorDataStoreState {
  rows: number;
  columns: number;
  originalWidth: number;
  originalHeight: number;
  filename?: string;
  /** 操作历史 */
  ops: Array<EditorOperation>;
  /** 指向最后一个已应用的操作索引，-1 表示没有已应用操作 */
  opIndex: number;
  /** 数据版本号，用于通知 UI 重绘（当 runtimePixels 异步加载完成或发生重大变更时更新） */
  dataVersion: number;
}

interface EditorDataStoreActions {
  setRows: (rows: number) => void;
  setColumns: (columns: number) => void;
  setOriginalSize: (width: number, height: number) => void;
  setFilename: (name?: string) => void;
  /** 不触发 React 渲染，自动触发防抖保存 */
  mutatePixels: (entries: [string, string | null][]) => void;
  /** 手动触发一次状态更新以保存数据 */
  triggerSave: () => void;
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
  /** 清除画布 */
  clearCanvas: () => void;
  /** 手动强制 UI 重绘 */
  forceRedraw: () => void;
}

export const useEditorDataStore = create<
  EditorDataStoreState & EditorDataStoreActions
>()(
  persist(
    (set, get) => {
      // 将 runtimePixels 直接存入 IDB，绕过 Zustand 状态更新，避免触发 React 渲染
      const debouncedSave = debounce(() => {
        console.log('debouncedSave', runtimePixels);
        setIDB(PIXELS_STORAGE_KEY, runtimePixels);
      }, 1000);

      // 立即保存 runtimePixels 到 IndexedDB
      const savePixelsNow = () => {
        debouncedSave.cancel();
        return setIDB(PIXELS_STORAGE_KEY, runtimePixels);
      };

      return {
        rows: INITIAL_ROWS,
        columns: INITIAL_COLUMNS,
        originalWidth: 0,
        originalHeight: 0,
        ops: [],
        opIndex: -1,
        dataVersion: 0,

        setRows: (rows) => set({ rows }),
        setColumns: (columns) => set({ columns }),
        setOriginalSize: (width, height) =>
          set({ originalWidth: width, originalHeight: height }),
        setFilename: (name) => set({ filename: name }),

        mutatePixels: (entries) => {
          for (const [key, val] of entries) {
            if (val === null) {
              runtimePixels.delete(key);
            } else {
              runtimePixels.set(key, val);
            }
          }
          debouncedSave();
          // 返回空对象，不触发 React 更新
          return {};
        },

        triggerSave: () => {
          debouncedSave.flush();
        },

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
            for (const c of op.changes) {
              const key = `${c.x},${c.y}`;
              if (c.prev == null) {
                runtimePixels.delete(key);
              } else {
                runtimePixels.set(key, c.prev);
              }
            }
            debouncedSave();
            return { opIndex: state.opIndex - 1 };
          }),
        redo: () =>
          set((state) => {
            if (state.opIndex >= state.ops.length - 1) return state;
            const op = state.ops[state.opIndex + 1];
            for (const c of op.changes) {
              const key = `${c.x},${c.y}`;
              if (c.next == null) {
                runtimePixels.delete(key);
              } else {
                runtimePixels.set(key, c.next);
              }
            }
            debouncedSave();
            return { opIndex: state.opIndex + 1 };
          }),
        createCanvas: (rows, columns, filename) => {
          runtimePixels.clear();
          savePixelsNow();

          set((state) => ({
            rows,
            columns,
            filename,
            originalWidth: 0,
            originalHeight: 0,
            ops: [],
            opIndex: -1,
            dataVersion: state.dataVersion + 1,
          }));
        },
        initializeFromPixelated: (p) => {
          runtimePixels.clear();
          if (p.pixels) {
            Object.entries(p.pixels).forEach(([k, v]) =>
              runtimePixels.set(k, v)
            );
          }
          savePixelsNow();

          set((state) => ({
            rows: p.rows,
            columns: p.columns,
            filename: p.filename,
            originalWidth: p.originalWidth,
            originalHeight: p.originalHeight,
            // 清空编辑相关状态
            ops: [],
            opIndex: -1,
            dataVersion: state.dataVersion + 1,
          }));
        },
        hasCanvas: () => {
          const s = get();
          return s.rows > 0 && s.columns > 0;
        },
        clearCanvas: () => {
          runtimePixels.clear();
          savePixelsNow();

          set((state) => ({
            rows: INITIAL_ROWS,
            columns: INITIAL_COLUMNS,
            filename: '',
            originalWidth: 0,
            originalHeight: 0,
            // 清空编辑相关状态
            ops: [],
            opIndex: -1,
            dataVersion: state.dataVersion + 1,
          }));
        },
        forceRedraw: () =>
          set((state) => ({ dataVersion: state.dataVersion + 1 })),
      };
    },
    {
      name: 'editor-data-store',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => Promise.resolve(null),
            setItem: () => Promise.resolve(),
            removeItem: () => Promise.resolve(),
          };
        }
        return {
          getItem: async (name: string) => {
            return (await get(name)) || null;
          },
          setItem: async (name: string, value: string) => {
            await setIDB(name, value);
          },
          removeItem: async (name: string) => {
            await del(name);
          },
        };
      }),
      partialize: (state) => ({
        filename: state.filename,
        rows: state.rows,
        columns: state.columns,
        ops: state.ops,
        opIndex: state.opIndex,
      }),
      onRehydrateStorage: () => async (state) => {
        if (typeof window === 'undefined') return;
        // 从独立存储加载像素数据
        const storedPixels = await get(PIXELS_STORAGE_KEY);
        if (storedPixels && storedPixels instanceof Map) {
          runtimePixels.clear();
          storedPixels.forEach((v, k) => runtimePixels.set(k, v));
          // 通知 UI 数据已加载完毕
          state?.forceRedraw();
        }
      },
    }
  )
);
