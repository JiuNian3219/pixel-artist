import { pixelateImage } from "@/utils/pixelate";

type PixelateTask = { algorithm: string; palette: string };

type PixelateBatchPayload = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  pixelSize: number;
  tasks: PixelateTask[];
};

type PixelateBatchResult = {
  data: Uint8ClampedArray;
  algorithm: string;
  palette: string;
};

export type PixelateBatchMessageData =
  | {
      type: typeof ResultType.RESULT;
      payload: PixelateBatchResult;
    }
  | { type: typeof ResultType.COMPLETE };

export const SendType = {
  PIXELATE_BATCH: "pixelate-batch",
} as const;

export const ResultType = {
  RESULT: "result",
  COMPLETE: "complete",
} as const;

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data as { type: string; payload: PixelateBatchPayload };
  if (msg?.type !== SendType.PIXELATE_BATCH) return;
  const { data, width, height, pixelSize, tasks } = msg.payload;

  for (const task of tasks) {
    const out = pixelateImage(
      data,
      width,
      height,
      pixelSize,
      task.algorithm,
      task.palette
    );
    // 逐条返回
    self.postMessage({
      type: ResultType.RESULT,
      payload: {
        data: out,
        algorithm: task.algorithm,
        palette: task.palette,
      },
    } as PixelateBatchMessageData);
  }

  self.postMessage({ type: ResultType.COMPLETE } as PixelateBatchMessageData);
};
