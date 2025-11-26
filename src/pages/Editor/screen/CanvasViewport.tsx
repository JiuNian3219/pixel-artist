import {
  bresenhamLine,
  clamp,
  getContrastColorForRGBA,
  MOUSE_BUTTON,
  parseColorString,
  rgbaEqual,
} from "@/pages/Editor/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { Point, Tool } from "@/types/editor";
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_TRANSLATION,
  DEFAULT_ZOOM,
  DEFAULT_ZOOM_LIMITS,
  MAX_FILL_CHECK_PREVIEW_NUMBER,
  MIN_ZOOM,
  TOOLS,
} from "@/utils/constants";
import { throttle } from "lodash";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../index.module.less";

export interface CanvasViewportHandle {
  exportImage: () => void;
}

const CanvasViewport = forwardRef<CanvasViewportHandle>((_props, ref) => {
  const rows = useEditorStore((s) => s.rows);
  const columns = useEditorStore((s) => s.columns);
  // CELL 随画布尺寸变化而变化
  const [cellSize, setCellSize] = useState<number>(DEFAULT_GRID_SIZE);
  const tool = useEditorStore((s) => s.tool);
  const color = useEditorStore((s) => s.color);
  const pencilSize = useEditorStore((s) => s.pencilSize);
  const exportPixelSize = useEditorStore((s) => s.pixelSize);
  const autoComplete = useEditorStore((s) => s.autoComplete);
  const originalWidth = useEditorStore((s) => s.originalWidth);
  const originalHeight = useEditorStore((s) => s.originalHeight);
  const filename = useEditorStore((s) => s.filename);
  const hasCanvas = useEditorStore((s) => s.hasCanvas);
  const setColor = useEditorStore((s) => s.setColor);
  const storePixels = useEditorStore((s) => s.pixels);
  const updatePixels = useEditorStore((s) => s.updatePixels);
  const commitOp = useEditorStore((s) => s.commitOp);

  // CSS transform 进行显示缩放
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [zoomLimits, setZoomLimits] = useState<{ min: number; max: number }>(
    DEFAULT_ZOOM_LIMITS
  );
  // 平移偏移量
  const [translate, setTranslate] = useState<{ x: number; y: number }>(
    DEFAULT_TRANSLATION
  );
  // 是否正在平移
  const [panning, setPanning] = useState(false);
  const panStartRef = useRef<Point | null>(null);
  const baseTranslateRef = useRef<{ x: number; y: number }>(
    DEFAULT_TRANSLATION
  );

  // 用于存储当前缩放比例，避免在 useEffect 中依赖 zoom 导致的循环调用
  const zoomRef = useRef(DEFAULT_ZOOM);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const stageSize = useMemo(
    () => ({
      width: columns * cellSize,
      height: rows * cellSize,
    }),
    [columns, rows, cellSize]
  );

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  // 用于存储当前画布上的像素
  const pixelsRef = useRef<Map<string, string>>(new Map());
  // 上次绘制的单元格，用于绘制连续线
  const lastCellRef = useRef<Point | null>(null);
  // 当前悬停的单元格，用于绘制连续线
  const hoverCellRef = useRef<Point | null>(null);
  // 是否正在绘制
  const drawingRef = useRef(false);
  // 当前真正在使用的工具（应对右键橡皮和中键拖拽）
  const gestureToolRef = useRef<Tool>(TOOLS.PENCIL);
  // 是否正在进行操作
  const opStartedRef = useRef<boolean>(false);
  // 操作变更记录，用于撤销重做
  const opChangesRef = useRef<
    Map<string, { prev: string | null; next: string | null }>
  >(new Map());
  // 下一次 store 像素变更触发时是否跳过全量重绘（一次性标记）
  const skipStoreReloadOnceRef = useRef<boolean>(false);

  /**
   * 获取当前工具状态
   * @returns 包含当前 UI 工具、手势工具和激活的工具
   */
  const getToolCtx = useCallback((): {
    uiTool: Tool;
    gestureTool: Tool;
    effectiveTool: Tool;
  } => {
    const uiTool = tool;
    const gestureTool = gestureToolRef.current;
    const effectiveTool = drawingRef.current ? gestureTool : uiTool;
    return { uiTool, gestureTool, effectiveTool };
  }, [tool, gestureToolRef, drawingRef]);

  /**
   * 开始一个操作：清空操作变更记录，标记操作已开始
   */
  const beginOp = () => {
    opStartedRef.current = true;
    opChangesRef.current.clear();
  };

  /**
   * 获取预览填充颜色
   * @returns 预览填充颜色的 rgba 字符串
   */
  const getPreviewFill = () => {
    // 在拖拽绘制时，预览颜色依据本次拖拽使用的工具
    const alpha = 0.35;
    if (getToolCtx().effectiveTool === "eraser")
      return `rgba(255, 255, 255, ${alpha})`;
    const { r, g, b } = parseColorString(color || "#000000");
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  /**
   * 获取指定单元格的 rgba 颜色
   * @param x 单元格 x 坐标
   * @param y 单元格 y 坐标
   * @returns 单元格的 rgba 颜色对象
   */
  const getRGBAForCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    const col = pixelsRef.current.get(key);
    if (!col) return { r: 0, g: 0, b: 0, a: 0 };
    return parseColorString(col);
  };

  /**
   * 绘制填充预览
   * @param cell 起始单元格坐标
   */
  const drawFillPreview = (cell: Point) => {
    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);

    const start = getRGBAForCell(cell.x, cell.y);
    const borderColor = getContrastColorForRGBA(start);

    const visited = new Uint8Array(rows * columns);
    const stack: Point[] = [cell];
    const region: Point[] = [];
    const MAX_CELLS = MAX_FILL_CHECK_PREVIEW_NUMBER;

    const matchStart = (x: number, y: number) => {
      if (x < 0 || x >= columns || y < 0 || y >= rows) return false;
      const rgba = getRGBAForCell(x, y);
      return rgbaEqual(rgba, start);
    };

    while (stack.length) {
      const p = stack.pop()!;
      const idx = p.y * columns + p.x;
      if (visited[idx]) continue;
      visited[idx] = 1;
      if (!matchStart(p.x, p.y)) continue;
      region.push(p);
      if (region.length > MAX_CELLS) break;
      // 4 邻域
      stack.push({ x: p.x + 1, y: p.y });
      stack.push({ x: p.x - 1, y: p.y });
      stack.push({ x: p.x, y: p.y + 1 });
      stack.push({ x: p.x, y: p.y - 1 });
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    const off = 0.5;
    if (region.length > MAX_CELLS) {
      // 区域过大时，退化为显示起始像素所在颜色块的粗略外接框
      let minX = cell.x,
        maxX = cell.x,
        minY = cell.y,
        maxY = cell.y;
      // 尝试扩大到同色的局部邻域
      for (let dy = -10; dy <= 10; dy++) {
        for (let dx = -10; dx <= 10; dx++) {
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          if (matchStart(nx, ny)) {
            minX = Math.min(minX, nx);
            maxX = Math.max(maxX, nx);
            minY = Math.min(minY, ny);
            maxY = Math.max(maxY, ny);
          }
        }
      }
      const x0 = minX * cellSize,
        y0 = minY * cellSize;
      const x1 = (maxX + 1) * cellSize,
        y1 = (maxY + 1) * cellSize;
      ctx.rect(x0 + off, y0 + off, x1 - x0, y1 - y0);
      ctx.stroke();
      return;
    }

    for (const p of region) {
      const x0 = p.x * cellSize;
      const y0 = p.y * cellSize;
      // 上边界
      if (!matchStart(p.x, p.y - 1)) {
        ctx.moveTo(x0 + off, y0 + off);
        ctx.lineTo(x0 + cellSize + off, y0 + off);
      }
      // 下边界
      if (!matchStart(p.x, p.y + 1)) {
        ctx.moveTo(x0 + off, y0 + cellSize + off);
        ctx.lineTo(x0 + cellSize + off, y0 + cellSize + off);
      }
      // 左边界
      if (!matchStart(p.x - 1, p.y)) {
        ctx.moveTo(x0 + off, y0 + off);
        ctx.lineTo(x0 + off, y0 + cellSize + off);
      }
      // 右边界
      if (!matchStart(p.x + 1, p.y)) {
        ctx.moveTo(x0 + cellSize + off, y0 + off);
        ctx.lineTo(x0 + cellSize + off, y0 + cellSize + off);
      }
    }
    ctx.stroke();
  };

  /**
   * 清除预览画布
   * @returns
   */
  const clearPreview = () => {
    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  /**
   * 视口中键拖动：按下开始，移动更新 translate，抬起结束
   * @param e 指针事件
   * @returns
   */
  const handleViewportPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const shouldPan =
      e.button === MOUSE_BUTTON.MIDDLE ||
      (e.button === MOUSE_BUTTON.LEFT && getToolCtx().uiTool === TOOLS.DRAG);
    if (!shouldPan) return;
    e.preventDefault();
    setPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
    baseTranslateRef.current = { ...translate };
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  /**
   * 视口中键拖动：移动更新 translate
   */
  const handleViewportPointerMove = useMemo(
    () =>
      throttle((e: React.PointerEvent<HTMLDivElement>) => {
        if (!panning || !panStartRef.current) return;
        e.preventDefault();
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        setTranslate({
          x: baseTranslateRef.current.x + dx,
          y: baseTranslateRef.current.y + dy,
        });
      }, 16),
    [panning]
  );

  /**
   * 视口中键拖动：抬起结束
   * @param e 指针事件
   * @returns
   */
  const handleViewportPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panning) return;
    e.preventDefault();
    setPanning(false);
    panStartRef.current = null;
    (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
  };

  /**
   * 绘制悬停预览
   * @param cell 悬停的像素坐标
   * @returns
   */
  const drawHoverPreview = (cell: Point) => {
    const { uiTool } = getToolCtx();
    // 填充工具：预览将被填充的区域边界
    if (!drawingRef.current && uiTool === TOOLS.FILL) {
      drawFillPreview(cell);
      return;
    }
    // 拖动没有预览
    if (uiTool === TOOLS.DRAG) return;

    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getPreviewFill();
    // 吸管工具的预览固定为 1×1 的方块，不随 pencilSize 变化
    const size = uiTool === TOOLS.PICKER ? 1 : Math.max(1, pencilSize);
    const half = Math.floor((size - 1) / 2);
    for (let by = 0; by < size; by++) {
      for (let bx = 0; bx < size; bx++) {
        const cx = clamp(cell.x - half + bx, 0, columns - 1);
        const cy = clamp(cell.y - half + by, 0, rows - 1);
        ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
      }
    }
  };

  /**
   * 绘制单个像素
   * @param ctx 画布上下文
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   * @param
   */
  const paintCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    col: string
  ) => {
    const key = `${x},${y}`;
    // 记录变更（仅在一次操作期间）
    if (opStartedRef.current) {
      const prev = pixelsRef.current.get(key) ?? null;
      const next = col ?? null;
      if (prev !== next) {
        const existed = opChangesRef.current.get(key);
        if (existed) {
          existed.next = next;
        } else {
          opChangesRef.current.set(key, { prev, next });
        }
      }
    }
    pixelsRef.current.set(key, col);
    ctx.fillStyle = col;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };

  /**
   * 清除单个像素
   * @param ctx 画布上下文
   * @param x 像素 x 坐标
   * @param y 像素 y 坐标
   */
  const clearCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const key = `${x},${y}`;
    if (opStartedRef.current) {
      const prev = pixelsRef.current.get(key) ?? null;
      const next = null;
      if (prev !== next) {
        const existed = opChangesRef.current.get(key);
        if (existed) {
          existed.next = next;
        } else {
          opChangesRef.current.set(key, { prev, next });
        }
      }
    }
    pixelsRef.current.delete(key);
    ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };

  /**
   * 应用画笔工具到单个像素
   * @param cell 像素坐标
   * @param activeTool 可选的活动工具（默认当前工具）
   * @returns
   */
  const applyBrush = (cell: Point, activeTool?: Tool) => {
    const pixelCanvas = pixelCanvasRef.current;
    if (!pixelCanvas) return;
    const ctx = pixelCanvas.getContext("2d");
    if (!ctx) return;
    const size = Math.max(1, pencilSize);
    const half = Math.floor((size - 1) / 2);
    for (let by = 0; by < size; by++) {
      for (let bx = 0; bx < size; bx++) {
        const cx = clamp(cell.x - half + bx, 0, columns - 1);
        const cy = clamp(cell.y - half + by, 0, rows - 1);
        const useTool = activeTool ?? tool;
        if (useTool === TOOLS.ERASER) {
          clearCell(ctx, cx, cy);
        } else {
          paintCell(ctx, cx, cy, color);
        }
      }
    }
  };

  /**
   * 从指针事件中获取像素坐标(会触发强制重排)
   * @param e 指针事件
   * @returns 像素坐标
   */
  const getCellFromEvent = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): Point => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // 修正坐标映射
    const x = clamp(Math.floor(px / (cellSize * zoom)), 0, columns - 1);
    const y = clamp(Math.floor(py / (cellSize * zoom)), 0, rows - 1);
    return { x, y };
  };

  /**
   * 处理指针按下事件
   * @param e 指针事件
   * @returns
   */
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // 中键用于平移，不在像素层绘制
    if (e.button === MOUSE_BUTTON.MIDDLE) return;
    const cell = getCellFromEvent(e);

    const { uiTool } = getToolCtx();
    if (uiTool === TOOLS.DRAG) {
      // 不阻止冒泡，让父容器的 pointerdown 捕获并开始平移
      return;
    }

    if (uiTool === TOOLS.PICKER) {
      const pixelCanvas = pixelCanvasRef.current;
      if (!pixelCanvas) return;
      const ctx = pixelCanvas.getContext("2d");
      if (!ctx) return;
      const data = ctx.getImageData(
        cell.x * cellSize,
        cell.y * cellSize,
        1,
        1
      ).data;
      const a = data[3];
      if (a === 0) {
        // 透明格不改变当前颜色
        return;
      }
      const toHex = (v: number) => v.toString(16).padStart(2, "0");
      const picked = `#${toHex(data[0])}${toHex(data[1])}${toHex(data[2])}`;
      setColor(picked);
      return;
    }

    if (uiTool === TOOLS.FILL) {
      e.preventDefault();
      const pixelCanvas = pixelCanvasRef.current;
      if (!pixelCanvas) return;
      const ctx = pixelCanvas.getContext("2d");
      if (!ctx) return;
      beginOp();

      // 起始颜色作为区域匹配基准
      const start = ctx.getImageData(
        cell.x * cellSize,
        cell.y * cellSize,
        1,
        1
      ).data;
      const isErase = e.button === MOUSE_BUTTON.RIGHT; // 右键擦除填充
      if (isErase) {
        if (start[3] === 0) return; // 已透明，无需填充
      } else {
        const { r, g, b } = parseColorString(color || "#000000");
        if (
          start[3] === 255 &&
          start[0] === r &&
          start[1] === g &&
          start[2] === b
        ) {
          return; // 与目标色相同，跳过
        }
      }

      const visited = new Uint8Array(rows * columns);
      const stack: Point[] = [cell];
      const matchStart = (x: number, y: number) => {
        const d = ctx.getImageData(x * cellSize, y * cellSize, 1, 1).data;
        return (
          d[0] === start[0] &&
          d[1] === start[1] &&
          d[2] === start[2] &&
          d[3] === start[3]
        );
      };

      while (stack.length) {
        const p = stack.pop()!;
        const idx = p.y * columns + p.x;
        if (visited[idx]) continue;
        visited[idx] = 1;
        if (!matchStart(p.x, p.y)) continue;
        if (isErase) {
          clearCell(ctx, p.x, p.y);
        } else {
          paintCell(ctx, p.x, p.y, color || "#000000");
        }
        // 4-邻域
        if (p.x + 1 < columns) stack.push({ x: p.x + 1, y: p.y });
        if (p.x - 1 >= 0) stack.push({ x: p.x - 1, y: p.y });
        if (p.y + 1 < rows) stack.push({ x: p.x, y: p.y + 1 });
        if (p.y - 1 >= 0) stack.push({ x: p.x, y: p.y - 1 });
      }
      return;
    }

    gestureToolRef.current =
      e.button === MOUSE_BUTTON.RIGHT
        ? TOOLS.ERASER
        : uiTool === TOOLS.ERASER
        ? TOOLS.ERASER
        : TOOLS.PENCIL;
    if (e.button === MOUSE_BUTTON.RIGHT) e.preventDefault();
    beginOp();
    drawingRef.current = true;
    applyBrush(cell, getToolCtx().effectiveTool);
    lastCellRef.current = cell;
    drawHoverPreview(cell);
  };

  /**
   * 处理指针松开事件
   * @returns
   */
  const handlePointerUp = () => {
    drawingRef.current = false;
    lastCellRef.current = null;
    // 提交像素缓存到 store（一次操作结束时）
    if (opStartedRef.current) {
      // 仅对变更过的单元格进行增量更新
      const entries = Array.from(opChangesRef.current.entries());
      if (entries.length > 0) {
        updatePixels((prev) => {
          const next = { ...prev };
          for (const [key, v] of entries) {
            if (v.next == null) {
              delete next[key];
            } else {
              next[key] = v.next;
            }
          }
          return next;
        });
        // 标记：这次 store 变更来自增量提交，跳过一次全量重绘
        skipStoreReloadOnceRef.current = true;
      }
      const changes = entries.map(([key, v]) => {
        const [xs, ys] = key.split(",");
        return { x: Number(xs), y: Number(ys), prev: v.prev, next: v.next };
      });
      if (changes.length > 0) {
        commitOp({ changes });
      }
      if (getToolCtx().uiTool === TOOLS.FILL) clearPreview();
      opChangesRef.current.clear();
      opStartedRef.current = false;
    }
  };

  /**
   * 处理指针移动事件（节流）
   * @param e 指针事件
   * @returns
   */
  const handlePointerMoveThrottled = useMemo(
    () =>
      throttle((e: React.PointerEvent<HTMLCanvasElement>) => {
        const { effectiveTool } = getToolCtx();
        // 拖动工具下不绘制预览/轨迹
        if (effectiveTool === TOOLS.DRAG || panning) return;
        const current = getCellFromEvent(e);
        if (!drawingRef.current) {
          hoverCellRef.current = current;
          drawHoverPreview(current);
          return;
        }
        const last = lastCellRef.current || current;
        const line = bresenhamLine(last, current);
        for (const p of line) {
          applyBrush(p, getToolCtx().effectiveTool);
        }
        lastCellRef.current = current;
        // 拖拽期间保持预览显示在当前光标位置
        drawHoverPreview(current);
      }, 16),
    [rows, columns, pencilSize, color, zoom, panning, getToolCtx]
  );

  // 导出：将当前像素层按 pixelSize 输出 PNG
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      const pixelCanvas = pixelCanvasRef.current;
      if (!pixelCanvas) return;
      const floorRows = Math.floor((originalHeight || 0) / exportPixelSize);
      const floorCols = Math.floor((originalWidth || 0) / exportPixelSize);
      const targetRows = autoComplete
        ? rows
        : Math.min(rows, floorRows || rows);
      const targetCols = autoComplete
        ? columns
        : Math.min(columns, floorCols || columns);

      const out = document.createElement("canvas");
      out.width = targetCols * exportPixelSize;
      out.height = targetRows * exportPixelSize;
      const outCtx = out.getContext("2d");
      if (!outCtx) return;
      outCtx.imageSmoothingEnabled = false;

      // 从显示层按格裁剪并缩放到导出像素尺寸
      const srcW = targetCols * cellSize;
      const srcH = targetRows * cellSize;
      outCtx.drawImage(
        pixelCanvas,
        0,
        0,
        srcW,
        srcH,
        0,
        0,
        out.width,
        out.height
      );

      const url = out.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = filename
        ? `${filename.replace(/\.[^.]+$/, "")}.png`
        : "pixel-art.png";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  }));

  /**
   * 处理鼠标滚轮事件（节流）
   * @param e 鼠标滚轮事件
   * @returns
   */
  const handleWheel = useMemo(
    () =>
      throttle((e: React.WheelEvent<HTMLDivElement>) => {
        const stageEl = stageRef.current;
        const containerEl = containerRef.current;
        if (!stageEl || !containerEl) return;
        const rect = stageEl.getBoundingClientRect();
        // 容器尺寸用于布局居中；缩放边界从初始化计算的 zoomLimits 提供
        e.preventDefault();

        const prevZoom = zoomRef.current;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;

        // 使用初始化时计算的缩放上下限，避免事件内重复计算
        const minLimit = zoomLimits.min;
        const maxLimit = zoomLimits.max;

        const rawNext = Number((prevZoom * factor).toFixed(3));
        const nextZoom = clamp(rawNext, minLimit, maxLimit);
        if (nextZoom === prevZoom) return;

        // 计算指针在当前缩放下对应的世界坐标（基于左上原点）
        const localX = clamp(e.clientX - rect.left, 0, rect.width);
        const localY = clamp(e.clientY - rect.top, 0, rect.height);
        const worldX = localX / prevZoom;
        const worldY = localY / prevZoom;

        // 更新平移，使该世界坐标在缩放后仍落在指针位置（叠加当前平移）
        setTranslate((prev) => ({
          x: prev.x + worldX * (prevZoom - nextZoom),
          y: prev.y + worldY * (prevZoom - nextZoom),
        }));
        setZoom(nextZoom);
      }, 16),
    [rows, columns, cellSize, zoomLimits]
  );

  // 初始化预览层尺寸
  useEffect(() => {
    const c = previewCanvasRef.current;
    if (!c) return;
    c.width = stageSize.width;
    c.height = stageSize.height;
    clearPreview();
  }, [stageSize.width, stageSize.height]);

  // 画笔大小/工具/颜色变化时，若鼠标未移动但存在悬停位置，则主动重绘预览，避免预览方块大小与当前画笔大小不一致
  useEffect(() => {
    if (drawingRef.current) return;
    const cell = hoverCellRef.current;
    if (cell) {
      drawHoverPreview(cell);
    }
  }, [pencilSize, tool, color]);

  // 新建画布后：基于容器大小计算一次 CELL，并计算缩放上下限；初始缩放按上下限夹取并居中
  useEffect(() => {
    if (!hasCanvas) return;
    const container = containerRef.current;
    const cw = container?.clientWidth ?? 0;
    const ch = container?.clientHeight ?? 0;
    if (cw > 0 && ch > 0 && rows > 0 && columns > 0) {
      const baseCell = Math.max(
        4,
        Math.floor(Math.min(cw / columns, ch / rows))
      );
      setCellSize(baseCell);
      const stageW = columns * baseCell;
      const stageH = rows * baseCell;
      const minBound = Math.min(cw / stageW, ch / stageH) * 0.5;
      const maxBound = ch / 2 / baseCell;
      const minLimit = Math.max(MIN_ZOOM, minBound);
      const maxLimit = Math.max(minLimit, maxBound);
      setZoomLimits({ min: minLimit, max: maxLimit });
      const initialZoom = minLimit / 0.5;
      setZoom(initialZoom);
      // 将缩放后的画布在自身盒内居中
      setTranslate({
        x: Math.floor((stageW * (1 - initialZoom)) / (2 * initialZoom)),
        y: Math.floor((stageH * (1 - initialZoom)) / (2 * initialZoom)),
      });
    }
  }, [hasCanvas, rows, columns]);

  // 初始化像素画布尺寸，调整尺寸会自动清空内容
  useEffect(() => {
    const pixelCanvas = pixelCanvasRef.current;
    if (!pixelCanvas) return;
    pixelCanvas.width = stageSize.width;
    pixelCanvas.height = stageSize.height;
    // 重置最近落点引用，避免尺寸变化后继续连接旧路径
    lastCellRef.current = null;
  }, [stageSize.width, stageSize.height]);

  // 加载 store 中的像素到画布
  useEffect(() => {
    // 若是本次绘制提交触发的像素更新，则跳过全量清空与重绘
    if (skipStoreReloadOnceRef.current) {
      skipStoreReloadOnceRef.current = false;
      return;
    }
    const pixelCanvas = pixelCanvasRef.current;
    if (!pixelCanvas) return;
    if (
      pixelCanvas.width !== stageSize.width ||
      pixelCanvas.height !== stageSize.height
    )
      return;
    const ctx = pixelCanvas.getContext("2d");
    if (!ctx) return;
    // 始终先清空再根据 store 重绘
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    pixelsRef.current.clear();
    if (storePixels && Object.keys(storePixels).length > 0) {
      for (const [key, val] of Object.entries(storePixels)) {
        const [xs, ys] = key.split(",");
        const x = Number(xs);
        const y = Number(ys);
        if (Number.isFinite(x) && Number.isFinite(y)) {
          // 直接同步像素到显示层，避免触发绘制路径的增量 store 写入
          pixelsRef.current.set(key, val);
          ctx.fillStyle = val;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [storePixels, stageSize.width, stageSize.height]);

  // 背景棋盘：#d9d9d9 与 #ffffff，每个显示格内再细分为 2x2 小方块
  useEffect(() => {
    const bg = bgCanvasRef.current;
    if (!bg) return;
    const ctx = bg.getContext("2d");
    if (!ctx) return;
    bg.width = stageSize.width;
    bg.height = stageSize.height;
    ctx.imageSmoothingEnabled = false;
    const c1 = "#d9d9d9";
    const c2 = "#ffffff";
    const subW = Math.max(1, Math.floor(cellSize / 2));
    const subH = subW;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const ox = x * cellSize;
        const oy = y * cellSize;
        const rw = cellSize - subW; // 右半宽度（处理奇数）
        const bh = cellSize - subH; // 下半高度（处理奇数）
        // 左上：c1
        ctx.fillStyle = c1;
        ctx.fillRect(ox, oy, subW, subH);
        // 右上：c2
        ctx.fillStyle = c2;
        ctx.fillRect(ox + subW, oy, rw, subH);
        // 左下：c2
        ctx.fillStyle = c2;
        ctx.fillRect(ox, oy + subH, subW, bh);
        // 右下：c1
        ctx.fillStyle = c1;
        ctx.fillRect(ox + subW, oy + subH, rw, bh);
      }
    }
  }, [stageSize.width, stageSize.height, rows, columns, cellSize]);

  useEffect(() => {
    return () => {
      handleWheel.cancel();
    };
  }, [handleWheel]);

  useEffect(() => {
    return () => {
      handlePointerMoveThrottled.cancel();
    };
  }, [handlePointerMoveThrottled]);

  useEffect(() => {
    return () => {
      handleViewportPointerMove.cancel();
    };
  }, [handleViewportPointerMove]);

  return (
    <div
      ref={containerRef}
      className={styles.CanvasViewport}
      onWheel={handleWheel}
      onPointerDown={handleViewportPointerDown}
      onPointerMove={handleViewportPointerMove}
      onPointerUp={handleViewportPointerUp}
      onPointerLeave={handleViewportPointerUp}
      style={{
        cursor:
          getToolCtx().uiTool === TOOLS.DRAG
            ? panning
              ? "grabbing"
              : "grab"
            : undefined,
      }}
    >
      <div
        ref={stageRef}
        className={styles.canvasStage}
        style={{
          width: stageSize.width,
          height: stageSize.height,
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
        }}
      >
        {/* 背景棋盘层 */}
        <canvas
          ref={bgCanvasRef}
          width={stageSize.width}
          height={stageSize.height}
          className={styles.bgCanvas}
        />
        {/* 像素层 */}
        <canvas
          ref={pixelCanvasRef}
          width={stageSize.width}
          height={stageSize.height}
          className={styles.pixelCanvas}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMoveThrottled}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {/* 预览层（浅色覆盖） */}
        <canvas
          ref={previewCanvasRef}
          width={stageSize.width}
          height={stageSize.height}
          className={styles.previewCanvas}
        />
      </div>
    </div>
  );
});

export default CanvasViewport;
