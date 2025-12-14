import { pixelateImage } from '@/utils/pixelate';
import {
  ResultType,
  SendType,
  type PixelateBatchMessageData,
  type PixelateBatchPayload,
} from './constants';

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
        width,
        height,
        algorithm: task.algorithm,
        palette: task.palette,
      },
    } as PixelateBatchMessageData);
  }

  self.postMessage({ type: ResultType.COMPLETE } as PixelateBatchMessageData);
};
