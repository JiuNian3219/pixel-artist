export type PixelateTask = { algorithm: string; palette: string };

export type PixelateBatchPayload = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  pixelSize: number;
  tasks: PixelateTask[];
};

export type PixelateBatchResult = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  algorithm: string;
  palette: string;
  pixelSize: number;
};

export const SendType = {
  PIXELATE_BATCH: 'pixelate-batch',
} as const;

export const ResultType = {
  RESULT: 'result',
  COMPLETE: 'complete',
} as const;

export type PixelateBatchMessageData =
  | {
      type: typeof ResultType.RESULT;
      payload: PixelateBatchResult;
    }
  | { type: typeof ResultType.COMPLETE };
