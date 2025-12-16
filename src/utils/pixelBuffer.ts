import { hexToUint32, uint32ToHex } from '@/utils/parsers';

/**
 * 像素数据管理器
 * 使用 Uint32Array 存储像素数据，替代 Map
 */
class PixelBuffer {
  private buffer: Uint32Array;
  private width: number;
  private height: number;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
    if (width > 0 && height > 0) {
      this.buffer = new Uint32Array(width * height);
    } else {
      this.buffer = new Uint32Array(0);
    }
  }

  /**
   * 初始化缓冲区
   * @param width 缓冲区宽度
   * @param height 缓冲区高度
   */
  init(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buffer = new Uint32Array(width * height);
  }

  /**
   * 获取像素值
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   * @returns 像素值的十六进制字符串 (000000-FFFFFF) 或 null (透明)
   */
  getPixel(x: number, y: number): string | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    const val = this.buffer[y * this.width + x];
    return val === 0 ? null : uint32ToHex(val);
  }

  /**
   * 获取像素值 (Uint32)
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   * @returns 像素值的 Uint32 整数 (0 表示透明)
   */
  getPixelUint32(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.buffer[y * this.width + x];
  }

  /**
   * 设置像素值
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   * @param color 颜色字符串 (000000-FFFFFF) 或 null (透明)
   */
  setPixel(x: number, y: number, color: string | null) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    const val = color ? hexToUint32(color) : 0;
    this.buffer[y * this.width + x] = val;
  }

  /**
   * 设置像素值 (Uint32)
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   * @param color 颜色 Uint32 整数 (0 表示透明)
   */
  setPixelUint32(x: number, y: number, color: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.buffer[y * this.width + x] = color;
  }

  /**
   * 删除像素 (设置为透明)
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   */
  deletePixel(x: number, y: number) {
    this.setPixelUint32(x, y, 0);
  }

  /**
   * 清除所有像素 (设置为透明)
   */
  clear() {
    this.buffer.fill(0);
  }

  /**
   * 获取原始 Buffer (用于 Worker 传输或保存)
   */
  getRawBuffer() {
    return this.buffer;
  }

  /**
   * 直接加载 Buffer
   * 如果传入的 buffer 长度不匹配 width * height，会自动调整
   * @param buffer 原始像素数据缓冲区
   * @param width 缓冲区宽度
   * @param height 缓冲区高度
   */
  loadRawBuffer(buffer: Uint32Array, width: number, height: number) {
    if (buffer.length !== width * height) {
      // 创建正确大小的 buffer 并尝试复制数据
      const newBuffer = new Uint32Array(width * height);
      newBuffer.set(buffer.subarray(0, width * height));
      this.buffer = newBuffer;
    } else {
      this.buffer = buffer;
    }
    this.width = width;
    this.height = height;
  }

  /**
   * 获取缓冲区尺寸
   * @returns 缓冲区尺寸 { width, height }
   */
  getDimensions() {
    return { width: this.width, height: this.height };
  }

  /**
   * 获取 Uint8ClampedArray 视图 (用于 ImageData)
   * 注意：返回的视图与 buffer 共享内存
   */
  getUint8ClampedArray(): Uint8ClampedArray {
    return new Uint8ClampedArray(
      this.buffer.buffer,
      this.buffer.byteOffset,
      this.buffer.byteLength
    );
  }

  /**
   * 用填充颜色填充x,y坐标所在的连通区域
   * 直接操作 Uint32Array，避免大量函数调用和对象创建
   * @param startX 填充起始 x 坐标
   * @param startY 填充起始 y 坐标
   * @param fillColorHex 填充颜色字符串 (000000-FFFFFF) 或 null (透明)
   * @returns 变更的像素索引列表 (indices) 和旧颜色 (oldHex)，若无变更返回 null
   */
  floodFill(
    startX: number,
    startY: number,
    fillColorHex: string | null
  ): { indices: number[]; oldHex: string | null } | null {
    if (
      startX < 0 ||
      startX >= this.width ||
      startY < 0 ||
      startY >= this.height
    )
      return null;

    const fillColor = fillColorHex ? hexToUint32(fillColorHex) : 0;
    const targetColor = this.buffer[startY * this.width + startX];

    // 如果目标颜色和填充颜色相同，不需要填充
    if (targetColor === fillColor) return null;
    const indices = this.getFillIndices(startX, startY);

    if (!indices || indices.length === 0) return null;

    this.fillIndices(indices, fillColorHex);
    const oldHex = targetColor === 0 ? null : uint32ToHex(targetColor);
    return { indices, oldHex };
  }

  /**
   * 获取填充区域的索引列表
   * 采用 扫描线 Flood Fill 算法
   * @param startX 填充起始 x 坐标
   * @param startY 填充起始 y 坐标
   * @returns 填充区域的索引列表 (indices)，若无变更返回 null
   */
  getFillIndices(startX: number, startY: number): number[] | null {
    if (
      startX < 0 ||
      startX >= this.width ||
      startY < 0 ||
      startY >= this.height
    )
      return null;

    const targetColor = this.buffer[startY * this.width + startX];
    const width = this.width;
    const height = this.height;
    const buffer = this.buffer;
    const indices: number[] = [];

    // 使用 Uint8Array 标记已访问，替代修改颜色
    const visited = new Uint8Array(width * height);

    // 使用栈存储待处理的像素坐标 (x, y)
    const stack: number[] = [startX, startY];

    while (stack.length > 0) {
      const y = stack.pop()!;
      let x = stack.pop()!;

      let idx = y * width + x;

      // 如果已访问或颜色不匹配，跳过
      if (visited[idx] || buffer[idx] !== targetColor) continue;

      // 向左寻找当前扫描线的起点
      while (x > 0 && buffer[idx - 1] === targetColor && !visited[idx - 1]) {
        x--;
        idx--;
      }

      let spanAbove = false;
      let spanBelow = false;

      // 向右扫描并填充
      while (x < width && buffer[idx] === targetColor && !visited[idx]) {
        visited[idx] = 1;
        indices.push(idx);

        // 检查上方行
        if (y > 0) {
          const upIdx = idx - width;
          // 需要同时检查颜色匹配且未被访问，才将其作为新种子放入栈
          const match = buffer[upIdx] === targetColor && !visited[upIdx];

          if (match) {
            if (!spanAbove) {
              stack.push(x, y - 1);
              spanAbove = true;
            }
          } else {
            spanAbove = false;
          }
        }

        // 检查下方行
        if (y < height - 1) {
          const downIdx = idx + width;
          const match = buffer[downIdx] === targetColor && !visited[downIdx];

          if (match) {
            if (!spanBelow) {
              stack.push(x, y + 1);
              spanBelow = true;
            }
          } else {
            spanBelow = false;
          }
        }

        x++;
        idx++;
      }
    }

    return indices;
  }

  /**
   * 批量填充指定索引的像素 (用于 Undo/Redo)
   */
  fillIndices(indices: number[], colorHex: string | null) {
    const color = colorHex ? hexToUint32(colorHex) : 0;
    const buffer = this.buffer;
    const len = indices.length;
    // 使用 for 循环比 for...of 稍微快一点
    for (let i = 0; i < len; i++) {
      const idx = indices[i];
      if (idx >= 0 && idx < buffer.length) {
        buffer[idx] = color;
      }
    }
  }

  /**
   * 高性能绘制正方形笔刷轨迹
   * @param x0 起点 X
   * @param y0 起点 Y
   * @param x1 终点 X
   * @param y1 终点 Y
   * @param size 笔刷大小
   * @param colorHex 颜色 (Hex字符串)
   * @param onPixelChange 可选的回调，用于记录变更 (Undo/Redo)
   */
  drawStroke(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    size: number,
    colorHex: string | null,
    onPixelChange?: (
      x: number,
      y: number,
      oldHex: string | null,
      newHex: string | null
    ) => void
  ) {
    if (size <= 0) return;
    const color = colorHex ? hexToUint32(colorHex) : 0;
    const width = this.width;
    const height = this.height;
    const buffer = this.buffer;

    // 笔刷半径 (对于偶数大小，中心偏左上)
    const r = Math.floor((size - 1) / 2);

    // 绘制单个点
    const drawPoint = (cx: number, cy: number) => {
      // 计算当前笔刷覆盖的范围
      const startX = Math.max(0, cx - r);
      const endX = Math.min(width - 1, cx - r + size - 1);
      const startY = Math.max(0, cy - r);
      const endY = Math.min(height - 1, cy - r + size - 1);

      if (startX > endX || startY > endY) return;

      for (let y = startY; y <= endY; y++) {
        const rowOffset = y * width;
        const startIdx = rowOffset + startX;
        const endIdx = rowOffset + endX + 1;

        if (onPixelChange) {
          for (let x = startX; x <= endX; x++) {
            const idx = rowOffset + x;
            const oldVal = buffer[idx];
            // 只在颜色真正改变时记录
            if (oldVal !== color) {
              onPixelChange(
                x,
                y,
                oldVal === 0 ? null : uint32ToHex(oldVal),
                colorHex
              );
            }
          }
        }

        // 批量填充一行
        buffer.fill(color, startIdx, endIdx);
      }
    };

    // 使用 Bresenham 算法绘制直线
    let x = x0;
    let y = y0;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      drawPoint(x, y);

      if (x === x1 && y === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }
}

export const pixelBuffer = new PixelBuffer();
