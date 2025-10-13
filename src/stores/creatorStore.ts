import {
  DEFAULT_ALGORITHM,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_PIXEL_SIZE,
} from "@/utils/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CreatorLocalState {
  pixelAlgorithm: string;
  paletteName: string;
  pixelSize: number;
  setPixelAlgorithm: (pixelAlgorithm: string) => void;
  setPaletteName: (paletteName: string) => void;
  setPixelSize: (pixelSize: number) => void;
}

export const useCreatorLocalStore = create<CreatorLocalState>()(
  persist(
    (set) => ({
      pixelAlgorithm: DEFAULT_ALGORITHM,
      paletteName: DEFAULT_COLOR_PALETTE,
      pixelSize: DEFAULT_PIXEL_SIZE,
      setPixelAlgorithm: (pixelAlgorithm) => set({ pixelAlgorithm }),
      setPaletteName: (paletteName) => set({ paletteName }),
      setPixelSize: (pixelSize) => set({ pixelSize }),
    }),
    {
      name: "creator-local-state-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
