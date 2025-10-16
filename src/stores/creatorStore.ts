import {
  DEFAULT_ALGORITHM,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_EXTEND_MODE,
  DEFAULT_PIXEL_SIZE,
  DEFAULT_SHOW_CONTROL_PIXEL_GRID,
  DEFAULT_SHOW_PREVIEW_PIXEL_GRID,
} from "@/utils/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CreatorLocalState {
  pixelAlgorithm: string;
  paletteName: string;
  pixelSize: number;
  extendMode: boolean;
  showPreviewPixelGrid: boolean;
  showControlPixelGrid: boolean;
  setPixelAlgorithm: (pixelAlgorithm: string) => void;
  setPaletteName: (paletteName: string) => void;
  setPixelSize: (pixelSize: number) => void;
  setExtendMode: (extendMode: boolean) => void;
  setShowPreviewPixelGrid: (showPreviewPixelGrid: boolean) => void;
  setShowControlPixelGrid: (showControlPixelGrid: boolean) => void;
}

export const useCreatorLocalStore = create<CreatorLocalState>()(
  persist(
    (set) => ({
      pixelAlgorithm: DEFAULT_ALGORITHM,
      paletteName: DEFAULT_COLOR_PALETTE,
      pixelSize: DEFAULT_PIXEL_SIZE,
      extendMode: DEFAULT_EXTEND_MODE,
      showPreviewPixelGrid: DEFAULT_SHOW_PREVIEW_PIXEL_GRID,
      showControlPixelGrid: DEFAULT_SHOW_CONTROL_PIXEL_GRID,
      setPixelAlgorithm: (pixelAlgorithm) => set({ pixelAlgorithm }),
      setPaletteName: (paletteName) => set({ paletteName }),
      setPixelSize: (pixelSize) => set({ pixelSize }),
      setExtendMode: (extendMode) => set({ extendMode }),
      setShowPreviewPixelGrid: (showPreviewPixelGrid) =>
        set({ showPreviewPixelGrid }),
      setShowControlPixelGrid: (showControlPixelGrid) =>
        set({ showControlPixelGrid }),
    }),
    {
      name: "creator-local-state-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
