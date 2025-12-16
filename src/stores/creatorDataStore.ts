import { type PixelateBatchPayload } from '@/workers/constants';
import { del, get as getIDB, set as setIDB } from 'idb-keyval';
import lodash from 'lodash';
import { create } from 'zustand';

const { uniqueId } = lodash;

const CREATOR_IMAGE_KEY = 'creator-original-image';
const CREATOR_RESULTS_KEY = 'creator-pixelated-results';
const CREATOR_CONFIG_KEY = 'creator-workspace-config';

export interface PixelatedResult {
  id: string;
  /** 像素化结果的 URL */
  url: string;
  algorithm: string;
  palette: string;
  /** 生成该结果时使用的像素大小 */
  pixelSize?: number;
  /** 像素化结果的 Blob 数据 */
  blob?: Blob;
}

export interface GenerationConfig {
  totalTasks: number;
  workerPayload: PixelateBatchPayload;
}

interface CreatorDataStoreState {
  results: PixelatedResult[];
  generationConfig: GenerationConfig | null;
}

interface CreatorDataStoreActions {
  /** 保存源图片到 IDB */
  setOriginalImage: (file: File) => Promise<void>;
  /** 保存生成配置 */
  setGenerationConfig: (config: GenerationConfig) => Promise<void>;
  /** 恢复工作区（上传的图片+像素化结果+任务配置） */
  restoreWorkspace: () => Promise<{
    file?: File;
    results: PixelatedResult[];
    config?: GenerationConfig;
  }>;
  /** 添加一个生成结果 */
  addResult: (result: Omit<PixelatedResult, 'id'>) => Promise<void>;
  /** 清除生成结果 */
  clearResults: () => Promise<void>;
  /** 清除工作区数据 */
  clearWorkspace: () => Promise<void>;
}

export const useCreatorDataStore = create<
  CreatorDataStoreState & CreatorDataStoreActions
>()((set) => ({
  results: [],
  generationConfig: null,

  setOriginalImage: async (file: File) => {
    try {
      await setIDB(CREATOR_IMAGE_KEY, file);
    } catch (error) {
      console.error('保存图片到 IndexedDB 失败:', error);
    }
  },

  setGenerationConfig: async (config: GenerationConfig) => {
    try {
      await setIDB(CREATOR_CONFIG_KEY, config);
      set({ generationConfig: config });
    } catch (error) {
      console.error('保存配置到 IndexedDB 失败:', error);
    }
  },

  restoreWorkspace: async () => {
    try {
      const file = (await getIDB(CREATOR_IMAGE_KEY)) as File;
      const storedResults = (await getIDB(CREATOR_RESULTS_KEY)) as Omit<
        PixelatedResult,
        'url'
      >[];
      const config = (await getIDB(CREATOR_CONFIG_KEY)) as GenerationConfig;

      const results: PixelatedResult[] = [];
      if (storedResults && Array.isArray(storedResults)) {
        storedResults.forEach((r) => {
          if (r.blob) {
            results.push({
              ...r,
              id: r.id || uniqueId(),
              url: URL.createObjectURL(r.blob),
            });
          }
        });
      }

      set({
        results,
        generationConfig: config || null,
      });
      return { file, results, config };
    } catch (error) {
      console.error('恢复工作区失败:', error);
      return { results: [] };
    }
  },

  addResult: async (newResult) => {
    try {
      const currentResults =
        ((await getIDB(CREATOR_RESULTS_KEY)) as Omit<
          PixelatedResult,
          'url'
        >[]) || [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url: _unused, ...rest } = newResult;
      const resultToStore = { ...rest, id: uniqueId() };

      const nextResults = [...currentResults, resultToStore];

      await setIDB(CREATOR_RESULTS_KEY, nextResults);

      set((state) => ({
        results: [...state.results, { ...resultToStore, url: newResult.url }],
      }));
    } catch (error) {
      console.error('添加结果到 IndexedDB 失败:', error);
    }
  },

  clearResults: async () => {
    try {
      await del(CREATOR_RESULTS_KEY);
      // 清除内存中的 URL, 避免内存泄漏
      useCreatorDataStore.getState().results.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });
      set({ results: [] });
    } catch (error) {
      console.error('清除 IndexedDB 结果失败:', error);
    }
  },

  clearWorkspace: async () => {
    try {
      await del(CREATOR_IMAGE_KEY);
      await del(CREATOR_RESULTS_KEY);
      await del(CREATOR_CONFIG_KEY);

      // 清除内存中的 URL, 避免内存泄漏
      useCreatorDataStore.getState().results.forEach((r) => {
        if (r.url) URL.revokeObjectURL(r.url);
      });

      set({
        results: [],
        generationConfig: null,
      });
    } catch (error) {
      console.error('清除工作区数据失败:', error);
    }
  },
}));
