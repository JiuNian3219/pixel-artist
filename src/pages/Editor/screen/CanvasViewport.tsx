import { clamp, getPreviewColor, MOUSE_BUTTON } from '@/pages/Editor/utils';
import { useEditorDataStore, useEditorUIStore } from '@/stores';
import type { Point, Tool } from '@/types/editor';
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_TRANSLATION,
  DEFAULT_ZOOM,
  DEFAULT_ZOOM_LIMITS,
  MIN_ZOOM,
  TOOLS,
} from '@/utils/constants';
import { pixelBuffer } from '@/utils/pixelBuffer';
import lodash from 'lodash';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../index.module.less';

const { throttle } = lodash;

export interface CanvasViewportHandle {
  exportImage: () => void;
}

const CanvasViewport = forwardRef<CanvasViewportHandle>((_props, ref) => {
  const rows = useEditorDataStore((s) => s.rows);
  const columns = useEditorDataStore((s) => s.columns);
  // CELL 随画布尺寸变化而变化
  const [cellSize, setCellSize] = useState<number>(DEFAULT_GRID_SIZE);
  const tool = useEditorUIStore((s) => s.tool);
  const color = useEditorUIStore((s) => s.color);
  const pencilSize = useEditorUIStore((s) => s.pencilSize);
  const exportPixelSize = useEditorUIStore((s) => s.exportPixelSize);
  const autoComplete = useEditorUIStore((s) => s.autoComplete);
  const originalWidth = useEditorDataStore((s) => s.originalWidth);
  const originalHeight = useEditorDataStore((s) => s.originalHeight);
  const importPixelSize = useEditorDataStore((s) => s.importPixelSize);
  const filename = useEditorDataStore((s) => s.filename);
  const hasCanvas = useEditorDataStore((s) => s.hasCanvas());
  const setColor = useEditorUIStore((s) => s.setColor);
  const mutatePixels = useEditorDataStore((s) => s.mutatePixels);
  const commitOp = useEditorDataStore((s) => s.commitOp);
  const dataVersion = useEditorDataStore((s) => s.dataVersion);
  const setTool = useEditorUIStore((s) => s.setTool);
  const pickerSwitchToPencil = useEditorUIStore((s) => s.pickerSwitchToPencil);

  const usedToolsRef = useRef<Tool[]>([tool]);

  useEffect(() => {
    const lastUsedTool = usedToolsRef.current[usedToolsRef.current.length - 1];
    if (lastUsedTool !== tool) {
      usedToolsRef.current.push(tool);
    }
  }, [tool]);

  /**
   * {@link panStartRef} 使用ref是因为：只在拖动开始时记录一次鼠标位置，后续计算差值使用，不需要触发重渲染。
   * {@link baseTranslateRef} 使用ref是因为：只在拖动开始时记录一次画布原始偏移量，作为计算基准，不需要触发重渲染。
   * {@link panning} 使用state是因为：拖动状态的变化（开始/结束）可能需要触发UI更新（如改变光标样式 `cursor: grabbing`），或者在渲染逻辑中进行条件判断。
   * {@link translate} 使用state是因为：这是直接控制画布位置的视觉状态（style.transform），每次更新都需要触发组件重渲染以更新DOM。
   * 关于拖动的生命周期：
   * 1. 鼠标按下: 设置 panning=true (state), 记录当前鼠标位置到 panStartRef, 记录当前画布偏移到 baseTranslateRef。
   * 2. 鼠标移动: 检查 panning 若为 true, 计算 (当前鼠标 - panStartRef) 得到增量, 更新 translate (state) = baseTranslateRef + 增量。
   * 3. 鼠标松开: 设置 panning=false (state), 结束拖动。
   */
  // 是否正在平移
  const [panning, setPanning] = useState(false);
  const panStartRef = useRef<Point | null>(null);
  // 拖动开始时的平移偏移量（已经平移过的偏移量），偏移相对浏览器窗口的左上角（源于canvasStage 样式的transform-origin: top left）
  const baseTranslateRef = useRef<{ x: number; y: number }>(
    DEFAULT_TRANSLATION
  );
  // 平移偏移量
  const [translate, setTranslate] = useState<{ x: number; y: number }>(
    DEFAULT_TRANSLATION
  );

  // CSS transform 进行显示缩放
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [zoomLimits, setZoomLimits] = useState<{ min: number; max: number }>(
    DEFAULT_ZOOM_LIMITS
  );
  // 用于存储当前缩放比例，避免在 useEffect 中依赖 zoom 导致的循环调用
  const zoomRef = useRef(DEFAULT_ZOOM);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // 画布尺寸
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

  /**
   * 将当前 PixelBuffer 渲染到 Canvas
   */
  const renderCanvas = useCallback(() => {
    const canvas = pixelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dims = pixelBuffer.getDimensions();
    if (dims.width !== columns || dims.height !== rows) {
      pixelBuffer.init(columns, rows);
    }

    const u8 = pixelBuffer.getUint8ClampedArray();
    const imgData = new ImageData(
      u8 as Uint8ClampedArray<ArrayBuffer>,
      columns,
      rows
    );
    ctx.putImageData(imgData, 0, 0);
  }, [columns, rows, dataVersion]);

  // 暴露导出图像的方法
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      // 确保 buffer 尺寸与当前画布一致
      const dims = pixelBuffer.getDimensions();
      if (dims.width !== columns || dims.height !== rows) {
        pixelBuffer.init(columns, rows);
      }

      const u8 = pixelBuffer.getUint8ClampedArray();
      const imgData = new ImageData(
        u8 as Uint8ClampedArray<ArrayBuffer>,
        columns,
        rows
      );

      // 创建临时源 Canvas (用于存放 ImageData)
      // 这里的ImageData 是原始的像素数据, 一个像素点只有1px
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = columns;
      srcCanvas.height = rows;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) return;
      srcCtx.putImageData(imgData, 0, 0);

      // 导出像素块大小
      const scale = Math.max(1, exportPixelSize || 1);

      // 默认导出完整网格
      let targetW = columns * scale;
      let targetH = rows * scale;

      // 如果需要裁切 (autoComplete = false) 且有原始尺寸信息，则还原到原始比例
      if (
        !autoComplete &&
        originalWidth > 0 &&
        originalHeight > 0 &&
        importPixelSize &&
        importPixelSize > 0
      ) {
        const ratio = scale / importPixelSize;
        targetW = Math.floor(originalWidth * ratio);
        targetH = Math.floor(originalHeight * ratio);
      }

      const out = document.createElement('canvas');
      out.width = targetW;
      out.height = targetH;
      const outCtx = out.getContext('2d');
      if (!outCtx) return;

      outCtx.imageSmoothingEnabled = false;
      outCtx.drawImage(
        srcCanvas,
        0,
        0,
        columns,
        rows,
        0,
        0,
        columns * scale,
        rows * scale
      );

      const url = out.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename
        ? `${filename.replace(/\.[^.]+$/, '')}.png`
        : 'pixel-art.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  }));

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
   * 获取倒数第几次使用的工具
   * @param n 倒数第几次使用的工具，默认值为 1, 0 表示当前工具
   * @returns
   */
  const getLastUsedTool = (n = 1) => {
    return usedToolsRef.current[usedToolsRef.current.length - n - 1];
  };

  /**
   * 开始一个操作：清空操作变更记录，标记操作已开始
   */
  const beginOp = () => {
    opStartedRef.current = true;
    opChangesRef.current.clear();
  };

  /**
   * 获取预览绘画颜色
   * @returns 预览填充颜色的 rgba 字符串
   */
  const getPreviewPaint = () => {
    // 在拖拽绘制时，预览颜色依据本次拖拽使用的工具
    const { effectiveTool } = getToolCtx();
    if (effectiveTool === 'eraser') return getPreviewColor('#ffffff').css;
    return getPreviewColor(color).css;
  };

  /**
   * 绘制填充预览
   * @param cell 起始单元格坐标
   */
  const drawFillPreview = (cell: Point) => {
    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    // 使用 putImageData 覆盖整个画布，因此不需要 clearRect
    // 但为了保险（例如ImageData创建失败），还是清空一下
    ctx.clearRect(0, 0, c.width, c.height);

    const { r, g, b, a } = getPreviewColor(color || '#000000', 0.5);

    const width = c.width;
    const height = c.height;
    // 创建一个和画布一样大的空白像素数据块
    // 这个数组的结构是 [R, G, B, A, R, G, B, A, ...]
    // 每个像素点有4个值，分别是红、绿、蓝、透明度
    // 即每个像素点的颜色信息是连续的4个字节
    // 此处操作的是Uint8ClampedArray类型的数组,内存空间中连续，比正常的Array类型快非常多
    // 同时会自动修正超出范围的颜色值（0-255）
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // 获取鼠标所在的填充区域的索引
    const indices = pixelBuffer.getFillIndices(cell.x, cell.y);
    if (!indices) return;

    const len = indices.length;
    for (let i = 0; i < len; i++) {
      const idx = indices[i];
      const dataIdx = idx * 4;
      data[dataIdx] = r;
      data[dataIdx + 1] = g;
      data[dataIdx + 2] = b;
      data[dataIdx + 3] = a;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  /**
   * 清除预览画布
   * @returns
   */
  const clearPreview = () => {
    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
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
    // 捕获指针事件，确保在拖动过程中不会丢失指针
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
        // 拖动计算公式：新位置 = 原来的位置 + 拖动距离
        //            拖动距离 = 当前位置 - 开始拖动位置
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
    // 释放指针捕获，确保后续事件不会被干扰
    (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
  };

  /**
   * 绘制悬停预览
   * @param cell 悬停的像素坐标
   * @returns
   */
  const drawHoverPreview = (cell: Point) => {
    const { uiTool } = getToolCtx();
    // 填充工具：预览将被填充的区域
    if (!drawingRef.current && uiTool === TOOLS.FILL) {
      drawFillPreview(cell);
      return;
    }
    // 拖动没有预览
    if (uiTool === TOOLS.DRAG) return;

    // 其他工具：预览将是一个 1×1 的像素方块，大小随 pencilSize 变化
    const c = previewCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getPreviewPaint();
    // 吸管工具的预览固定为 1×1 的方块，不随 pencilSize 变化
    const size = uiTool === TOOLS.PICKER ? 1 : Math.max(1, pencilSize);
    const half = Math.floor((size - 1) / 2);
    for (let by = 0; by < size; by++) {
      for (let bx = 0; bx < size; bx++) {
        const cx = cell.x - half + bx;
        const cy = cell.y - half + by;
        // 使用 1x1 逻辑像素绘制半透明预览
        // 不需要 clamping，Canvas 会自动忽略绘制在边界外的部分，从而实现"滑出"效果
        ctx.fillRect(cx, cy, 1, 1);
      }
    }
  };

  /**
   * 记录单个像素变更
   * @param x 像素坐标 x
   * @param y 像素坐标 y
   * @param prev 变更前的颜色值
   * @param next 变更后的颜色值
   */
  const recordPixelChange = useCallback(
    (x: number, y: number, prev: string | null, next: string | null) => {
      const key = `${x},${y}`;
      if (opStartedRef.current) {
        if (prev !== next) {
          const existed = opChangesRef.current.get(key);
          if (existed) {
            existed.next = next;
          } else {
            opChangesRef.current.set(key, { prev, next });
          }
        }
      }
    },
    []
  );

  /**
   * 将当前工具的笔触操作提交到 PixelBuffer（纯数据更新，不涉及渲染）
   * @param start 起始坐标
   * @param end 结束坐标
   * @param activeTool 可选的活动工具（默认当前工具）
   */
  const commitStrokeToBuffer = (
    start: Point,
    end: Point,
    activeTool?: Tool
  ) => {
    const size = Math.max(1, pencilSize);
    const useTool = activeTool ?? tool;

    // 橡皮擦也是画笔，只是颜色为 null (或透明)
    const brushColor = useTool === TOOLS.ERASER ? null : color;

    pixelBuffer.drawStroke(
      start.x,
      start.y,
      end.x,
      end.y,
      size,
      brushColor,
      recordPixelChange
    );
  };

  /**
   * 从指针事件中获取像素坐标(会触发强制重排)
   * @param e 指针事件
   * @returns 像素坐标
   */
  const getCellFromEvent = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): Point => {
    // rect 当前canvas的显示矩形区域
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    // clientX, clientY 指针事件在浏览器窗口中的坐标（相对窗口左上角）
    // rect.left, rect.top  canvas 元素在页面中的位置（相对窗口左上角）
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // 修正坐标映射: 直接基于当前显示尺寸与逻辑分辨率的比例
    // px / 宽度 = 指针位于canvas宽度比例位置， 乘以列数 = 指针位于canvas宽度比例位置对应的列数，相当于坐标x
    const x = Math.floor((px / rect.width) * columns);
    const y = Math.floor((py / rect.height) * rows);
    // 不进行 clamping，允许返回画布外的坐标，以便实现"虚拟笔刷"（指笔刷出去边界后仍保持绘画状态）
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
      const picked = pixelBuffer.getPixel(cell.x, cell.y);
      if (picked) {
        setColor(picked);
      }
      return;
    }

    if (uiTool === TOOLS.FILL) {
      e.preventDefault();
      beginOp();

      const isErase = e.button === MOUSE_BUTTON.RIGHT;
      const targetColor = isErase ? null : color;

      const result = pixelBuffer.floodFill(cell.x, cell.y, targetColor);

      if (result) {
        const { indices, oldHex } = result;

        // 优化：直接存储索引列表，而不是百万级的变更对象数组
        commitOp({
          type: 'fill',
          fillData: {
            indices,
            prev: oldHex,
            next: targetColor,
          },
        });

        // 触发防抖保存
        mutatePixels([]);

        renderCanvas();
      }
      return;
    }

    // 处理普通画笔/橡皮擦操作
    gestureToolRef.current =
      e.button === MOUSE_BUTTON.RIGHT
        ? TOOLS.ERASER
        : uiTool === TOOLS.ERASER
          ? TOOLS.ERASER
          : TOOLS.PENCIL;
    if (e.button === MOUSE_BUTTON.RIGHT) e.preventDefault();
    beginOp();
    // 捕获指针事件，确保在拖动过程中不会丢失指针
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;

    // 记录点击
    commitStrokeToBuffer(cell, cell, getToolCtx().effectiveTool);
    renderCanvas();
    lastCellRef.current = cell;
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
      const entries = Array.from(opChangesRef.current.entries());
      const changes = entries.map(([key, v]) => {
        const [xs, ys] = key.split(',');
        return { x: Number(xs), y: Number(ys), prev: v.prev, next: v.next };
      });
      if (changes.length > 0) {
        commitOp({ type: 'stroke', changes });
      }
      opChangesRef.current.clear();
      opStartedRef.current = false;
    }
    const { uiTool } = getToolCtx();
    if (uiTool === TOOLS.FILL) clearPreview();
    if (pickerSwitchToPencil && uiTool === TOOLS.PICKER)
      setTool(getLastUsedTool());
  };

  /**
   * 实际的指针移动处理逻辑
   * 提取为非节流函数，通过 ref 保持最新引用，解决闭包陷阱
   * @param e 指针事件
   */
  const handlePointerMoveLogic = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
    commitStrokeToBuffer(last, current, effectiveTool);
    renderCanvas();
    lastCellRef.current = current;
    // 拖拽期间保持预览显示在当前光标位置
    drawHoverPreview(current);
  };

  const handlePointerMoveLogicRef = useRef(handlePointerMoveLogic);
  handlePointerMoveLogicRef.current = handlePointerMoveLogic;

  /**
   * 处理指针移动事件（节流）
   * @param e 指针事件
   * @returns
   */
  const handlePointerMoveThrottled = useMemo(
    () =>
      throttle((e: React.PointerEvent<HTMLCanvasElement>) => {
        handlePointerMoveLogicRef.current(e);
      }, 16),
    []
  );

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

  // 当数据版本或尺寸变化时，重绘
  useEffect(() => {
    renderCanvas();
  }, [rows, columns, dataVersion, renderCanvas]);

  // 画笔大小/工具/颜色变化时，若鼠标未移动但存在悬停位置，则主动重绘预览，避免预览方块大小颜色与当前画笔大小不一致
  useEffect(() => {
    if (drawingRef.current) return;
    const cell = hoverCellRef.current;
    if (cell) {
      drawHoverPreview(cell);
    }
  }, [pencilSize, tool, color]);

  // 新建画布或尺寸变化后：自动适配视口
  useEffect(() => {
    // 对画布做的初始化，目的是让画布正好占满容器，且不超出容器边界，同时缩放保证
    if (!hasCanvas) return;
    const container = containerRef.current;
    const cw = container?.clientWidth ?? 0;
    const ch = container?.clientHeight ?? 0;

    if (cw > 0 && ch > 0 && rows > 0 && columns > 0) {
      // 计算基础单元格大小
      // 目的是让整个网格能完整塞进容器里，类似背景图片的contain模式
      // 例子：容器 1000x500，画布 100x100
      // 按宽算：1000/100 = 10px/格；按高算：500/100 = 5px/格
      // 取最小值 5px，才能保证宽高都不溢出容器
      // 同时设置最小值为 4px，这里是因为背景格子用的是马赛克样式，左上 白 右上 灰 左下 灰 右下 白，所以最小也要4px
      const baseCell = Math.max(
        4,
        Math.floor(Math.min(cw / columns, ch / rows))
      );
      setCellSize(baseCell);

      // 计算画布在 基础单元格大小下的实际物理尺寸
      const stageW = columns * baseCell;
      const stageH = rows * baseCell;

      // 计算最小缩放比例，这里是保证画布即使在最小缩放时，也能至少占据容器的一半空间（* 0.5）
      // 避免用户一缩小，画布就变成一个看不见的点
      const minBound = Math.min(cw / stageW, ch / stageH) * 0.5;

      // 计算最大缩放比例，这里的逻辑是：限制最大放大倍数，防止用户无限放大
      // 最大只能放大到 屏幕高度的一半只能显示 2 个格子 的程度
      const maxBound = ch / 2 / baseCell;

      // 结合全局常量 MIN_ZOOM，确定最终的缩放范围
      // 确保最小缩放不低于 MIN_ZOOM，同时也不大于最大缩放
      const minLimit = Math.max(MIN_ZOOM, minBound);
      const maxLimit = Math.max(minLimit, maxBound);
      setZoomLimits({ min: minLimit, max: maxLimit });

      // 设定初始缩放值，此处是为了消除偏移误差
      // 因为 baseCell 被强制向下取整（Math.floor），导致 stageW/stageH 会略小于容器尺寸
      // minBound 计算时用了真实比例 (cw/stageW)，这里的 minLimit*2 其实就是还原了这个比例
      // 让画布通过微小的放大（比如 1.05x），在视觉上完美撑满容器
      const initialZoom = minLimit * 2;
      setZoom(initialZoom);

      // 计算居中偏移量
      // (容器宽 - 画布实际宽 * 缩放) / 2 = 居中所需的左边距
      setTranslate({
        x: Math.floor((cw - stageW * initialZoom) / 2),
        y: Math.floor((ch - stageH * initialZoom) / 2),
      });
    }
  }, [hasCanvas, rows, columns]);

  // 尺寸变化时重置交互状态
  useEffect(() => {
    lastCellRef.current = null;
  }, [rows, columns]);

  // 监听 Store 变化（撤销/重做/重置），同步视觉状态
  useEffect(() => {
    const unsub = useEditorDataStore.subscribe((state, prevState) => {
      // 只要操作历史或索引发生变化，说明数据已被 Store 更新，直接重绘
      if (state.opIndex !== prevState.opIndex || state.ops !== prevState.ops) {
        renderCanvas();
      }
    });
    return unsub;
  }, [renderCanvas]);

  // 背景棋盘：#d9d9d9 与 #ffffff，每个显示格内再细分为 2x2 小方块
  useEffect(() => {
    const bg = bgCanvasRef.current;
    if (!bg) return;
    const ctx = bg.getContext('2d');
    if (!ctx) return;

    const w = columns * 2;
    const h = rows * 2;
    bg.width = w;
    bg.height = h;

    ctx.imageSmoothingEnabled = false;
    const c1 = '#d9d9d9';
    const c2 = '#ffffff';

    // 纹理填充
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 2;
    patternCanvas.height = 2;
    const pCtx = patternCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = c1;
      pCtx.fillRect(0, 0, 1, 1);
      pCtx.fillRect(1, 1, 1, 1);
      pCtx.fillStyle = c2;
      pCtx.fillRect(1, 0, 1, 1);
      pCtx.fillRect(0, 1, 1, 1);

      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
    }
  }, [rows, columns]);

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
              ? 'grabbing'
              : 'grab'
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
          width={columns * 2}
          height={rows * 2}
          className={styles.bgCanvas}
        />
        {/* 像素层 */}
        <canvas
          ref={pixelCanvasRef}
          width={columns}
          height={rows}
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
          width={columns}
          height={rows}
          className={styles.previewCanvas}
        />
      </div>
    </div>
  );
});

export default CanvasViewport;
