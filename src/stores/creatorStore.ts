import {
  DEFAULT_ALGORITHM,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_EXTEND_MODE,
  DEFAULT_MULTI_ALGORITHM_ENABLED,
  DEFAULT_PIXEL_SIZE,
  DEFAULT_PREVIEW_COLUMNS,
  DEFAULT_PREVIEW_HEIGHT,
  DEFAULT_SELECTED_ALGORITHMS,
  DEFAULT_SELECTED_PALETTES,
  DEFAULT_SHOW_CONTROL_PIXEL_GRID,
  DEFAULT_SHOW_PREVIEW_PIXEL_GRID,
  DEFAULT_TASK_FACTORS_ORDER,
  TASK_FACTORS,
} from "@/utils/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CreatorLocalState {
  pixelAlgorithm: string;
  paletteName: string;
  pixelSize: number;
  extendMode: boolean;
  multiAlgorithmEnabled: boolean;
  selectedAlgorithms: string[];
  selectedPalettes: string[];
  taskFactorsOrder: (typeof TASK_FACTORS)[keyof typeof TASK_FACTORS][];
  inPixelation: boolean;
  showPreviewPixelGrid: boolean;
  showControlPixelGrid: boolean;
  previewColumns: number;
  defaultPreviewHeight: number;
  setPixelAlgorithm: (pixelAlgorithm: string) => void;
  setPaletteName: (paletteName: string) => void;
  setPixelSize: (pixelSize: number) => void;
  setExtendMode: (extendMode: boolean) => void;
  setMultiAlgorithmEnabled: (multiAlgorithmEnabled: boolean) => void;
  setSelectedAlgorithms: (selectedAlgorithms: string[]) => void;
  setSelectedPalettes: (selectedPalettes: string[]) => void;
  setTaskFactorsOrder: (
    order: (typeof TASK_FACTORS)[keyof typeof TASK_FACTORS][]
  ) => void;
  setInPixelation: (inPixelation: boolean) => void;
  setShowPreviewPixelGrid: (showPreviewPixelGrid: boolean) => void;
  setShowControlPixelGrid: (showControlPixelGrid: boolean) => void;
  setPreviewColumns: (previewColumns: number) => void;
  setDefaultPreviewHeight: (height: number) => void;
}

export const useCreatorLocalStore = create<CreatorLocalState>()(
  persist(
    (set) => ({
      pixelAlgorithm: DEFAULT_ALGORITHM,
      paletteName: DEFAULT_COLOR_PALETTE,
      pixelSize: DEFAULT_PIXEL_SIZE,
      extendMode: DEFAULT_EXTEND_MODE,
      multiAlgorithmEnabled: DEFAULT_MULTI_ALGORITHM_ENABLED,
      selectedAlgorithms: DEFAULT_SELECTED_ALGORITHMS,
      selectedPalettes: DEFAULT_SELECTED_PALETTES,
      taskFactorsOrder: Array.from(DEFAULT_TASK_FACTORS_ORDER),
      inPixelation: false,
      showPreviewPixelGrid: DEFAULT_SHOW_PREVIEW_PIXEL_GRID,
      showControlPixelGrid: DEFAULT_SHOW_CONTROL_PIXEL_GRID,
      previewColumns: DEFAULT_PREVIEW_COLUMNS,
      defaultPreviewHeight: DEFAULT_PREVIEW_HEIGHT,
      setPixelAlgorithm: (pixelAlgorithm) => set({ pixelAlgorithm }),
      setPaletteName: (paletteName) => set({ paletteName }),
      setPixelSize: (pixelSize) => set({ pixelSize }),
      setExtendMode: (extendMode) => set({ extendMode }),
      setMultiAlgorithmEnabled: (multiAlgorithmEnabled) =>
        set({ multiAlgorithmEnabled }),
      setSelectedAlgorithms: (selectedAlgorithms) =>
        set({ selectedAlgorithms }),
      setSelectedPalettes: (selectedPalettes) => set({ selectedPalettes }),
      setTaskFactorsOrder: (order) => set({ taskFactorsOrder: order }),
      setInPixelation: (inPixelation) => set({ inPixelation }),
      setShowPreviewPixelGrid: (showPreviewPixelGrid) =>
        set({ showPreviewPixelGrid }),
      setShowControlPixelGrid: (showControlPixelGrid) =>
        set({ showControlPixelGrid }),
      setPreviewColumns: (previewColumns) => set({ previewColumns }),
      setDefaultPreviewHeight: (height) =>
        set({ defaultPreviewHeight: height }),
    }),
    {
      name: "creator-local-state-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
