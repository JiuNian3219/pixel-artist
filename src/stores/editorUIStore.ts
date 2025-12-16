import type { Tool } from '@/types/editor';
import {
  DEFAULT_AUTO_COMPLETE,
  DEFAULT_COLOR,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_EXPORT_PIXEL_SIZE,
  DEFAULT_PENCIL_SIZE,
  DEFAULT_PICKER_SWITCH_TO_PENCIL,
  DEFAULT_PIXEL_SIZE,
  DEFAULT_TOOL,
} from '@/utils/constants';
import { getStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Updater<T> = T | ((prev: T) => T);

interface EditorUIStoreState {
  tool: Tool;
  color: string;
  paletteName: string;
  pencilSize: number;
  /** 导出像素大小 */
  exportPixelSize: number;
  /** 是否启用边缘填充 */
  autoComplete: boolean;
  /** 是否启用拾色器工具颜色后切换到画笔工具 */
  pickerSwitchToPencil: boolean;
}

interface EditorUIStoreActions {
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setPaletteName: (name: string) => void;
  setPencilSize: (pencilSize: Updater<number>) => void;
  setExportPixelSize: (pixelSize: number) => void;
  setAutoComplete: (autoComplete: boolean) => void;
  setPickerSwitchToPencil: (pickerSwitchToPencil: boolean) => void;
  /** 重置 UI 状态到默认值（除页面配置） */
  resetUI: () => void;
}

export const useEditorUIStore = create<
  EditorUIStoreState & EditorUIStoreActions
>()(
  persist(
    (set) => ({
      tool: DEFAULT_TOOL,
      color: DEFAULT_COLOR,
      paletteName: DEFAULT_COLOR_PALETTE,
      pencilSize: DEFAULT_PENCIL_SIZE,
      exportPixelSize: DEFAULT_PIXEL_SIZE,
      autoComplete: DEFAULT_AUTO_COMPLETE,
      pickerSwitchToPencil: DEFAULT_PICKER_SWITCH_TO_PENCIL,

      setTool: (tool) => set({ tool }),
      setColor: (color) => set({ color }),
      setPaletteName: (name) => set({ paletteName: name }),
      setPencilSize: (pencilSize) =>
        set((state) => ({
          pencilSize:
            typeof pencilSize === 'function'
              ? pencilSize(state.pencilSize)
              : pencilSize,
        })),
      setExportPixelSize: (pixelSize) => set({ exportPixelSize: pixelSize }),
      setAutoComplete: (autoComplete) => set({ autoComplete }),
      setPickerSwitchToPencil: (pickerSwitchToPencil) =>
        set({ pickerSwitchToPencil }),

      resetUI: () =>
        set({
          tool: DEFAULT_TOOL,
          color: DEFAULT_COLOR,
          paletteName: DEFAULT_COLOR_PALETTE,
          pencilSize: DEFAULT_PENCIL_SIZE,
          exportPixelSize: DEFAULT_EXPORT_PIXEL_SIZE,
        }),
    }),
    {
      name: 'editor-ui-store',
      storage: createJSONStorage(() => getStorage()),
    }
  )
);
