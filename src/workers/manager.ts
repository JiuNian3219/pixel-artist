import type { PixelateBatchMessageData } from './constants';

type WorkerCallback = (data: PixelateBatchMessageData) => void;

class PixelWorkerManager {
  private worker: Worker | null = null;
  private listeners: Set<WorkerCallback> = new Set();

  constructor() {
    // 手动初始化，避免 SSR 报错
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (this.worker) {
      this.worker.terminate();
    }

    this.worker = new Worker(new URL('./pixelWorker.ts', import.meta.url), {
      type: 'module',
    });

    this.worker.onmessage = (e) => {
      this.notify(e.data);
    };
  }

  public postMessage(msg: any, transfer?: Transferable[]) {
    if (!this.worker) this.init();
    this.worker?.postMessage(msg, transfer || []);
  }

  /**
   * 强制重启 Worker
   * 用于清除当前正在进行的任务，防止旧任务结果污染
   */
  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    // 重新初始化以便接受新任务
    this.init();
  }

  /**
   * 订阅 Worker 消息
   * @returns 取消订阅函数
   */
  public subscribe(callback: WorkerCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * 通知所有订阅者 Worker 消息
   * @param data Worker 消息数据
   */
  private notify(data: PixelateBatchMessageData) {
    this.listeners.forEach((cb) => cb(data));
  }
}

export const pixelWorkerManager = new PixelWorkerManager();
