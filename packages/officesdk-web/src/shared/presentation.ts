import type { EditorContent } from './editor';

/**
 * Presentation 远程调用的方法定义，
 * 作为契约，用于统一约束客户端和服务端的接口。
 * 这里只有类型定义，不包含任何实现。
 */
export type PresentationMethods = {
  /**
   * 获取选区接口
   */
  getSelection: () => PresentationSelection;

  /**
   * 获取内容接口
   */
  getContent: () => EditorContent;

  /**
   * 获取当前幻灯片的缩放接口
   */
  getZoom: () => PresentationZoom;

  /**
   * 获取幻灯片集合接口
   */
  getSlides: () => PresentationSlides;
};

/**
 * 幻灯片编辑器实例接口
 */
export interface PresentationEditor {
  readonly selection: PresentationSelection;
  readonly content: EditorContent;
  readonly zoom: PresentationZoom;
  readonly slides: PresentationSlides;
}

/**
 * 幻灯片选区接口
 */
export type PresentationSelection = {
  /**
   * 获取选区的文本区域范围，
   * 如果选区不存在，则返回 null。
   * @returns
   */
  getTextRange: () => PresentationTextRange | null;

  /**
   * 设置选区的文本区域范围，
   * 设置后，选区会自动选中指定范围。
   * 如果设置为 null，则清空选区。
   * @param value 选区的区域范围
   */
  setTextRange: (range: PresentationTextRangeValue | null) => void;

  /**
   * 获取当前选中的形状，
   * 如果没有选中形状，则返回 null。
   */
  getSelectedShapes: () => PresentationShape[] | null;

  /**
   * 选中指定的形状，选中形状后会清空文字选区。
   * 如果 value 为 null，则清空选中的形状。
   * @param ids 指定的形状 id
   */
  setSelectedShapes: (ids: string[] | null) => void;

  /**
   * 添加选区变化监听器，当选区发生变化时，会触发回调。
   * @param listener
   * @returns
   */
  addRangeListener: (listener: (range: PresentationTextRangeValue) => void) => void;
};

/**
 * 幻灯片文本区域接口
 */
export interface PresentationTextRange {
  /**
   * 区域的开始位置，
   * 当内容发生变化后，区域的标识可能会失效。
   */
  readonly start: string;

  /**
   * 区域的结束位置，
   * 当内容发生变化后，区域的标识可能会失效。
   */
  readonly end: string;

  /**
   * 获取该区域对应的纯文本信息。
   * @returns 返回纯文本字符串
   */
  getText: () => string;

  /**
   * 设置该区域的内容
   * @param text 内容
   */
  setText: (text: string) => void;

  /**
   * 将区域中的内容以 HTML 格式返回。
   * @returns 返回 HTML 字符串
   */
  getHtml: () => string;

  /**
   * 设置该区域的内容为 HTML 格式
   * @param html 内容
   */
  setHtml: (html: string) => void;
}

/**
 * 可用于描述一个幻灯片文本区域的信息。
 */
export interface PresentationTextRangeValue {
  start: string;
  end: string;
}

/**
 * 幻灯片形状接口
 */
export interface PresentationShape {
  /**
   * 获取形状的 id
   */
  readonly id: string;
}

/**
 * 幻灯片缩放接口
 */
export type PresentationZoom = {
  /**
   * 获取当前缩放比例。
   * @returns
   */
  getPercentage: () => number;

  /**
   * 设置缩放比例，
   * 有效范围 10 ~ 500。
   * @param percentage
   */
  setPercentage: (percentage: number) => void;

  /**
   * 设置自动缩放模式，
   * none: 不自动缩放，默认值。
   * window: 根据窗口宽度自动缩放，页面宽度随着窗口宽度变化而变化
   * @param mode 缩放模式
   */
  setFitMode: (mode: 'none' | 'window') => void;

  /**
   * 获取当前缩放模式。
   * @returns
   */
  getFitMode: () => 'none' | 'window';

  /**
   * 放大。
   */
  zoomIn: () => void;

  /**
   * 缩小。
   */
  zoomOut: () => void;
};

/**
 * 幻灯片页面接口
 */
export interface PresentationSlide {
  /**
   * 当前幻灯片的 id
   */
  readonly id: string;

  /**
   * 获取当前幻灯片在所有幻灯片中的索引
   * @returns
   */
  getIndex: () => number;

  /**
   * 获取当前页面所有的形状
   * @returns
   */
  getShapes: () => PresentationShape[];
}

/**
 * 幻灯片集合接口
 */
export interface PresentationSlides {
  /**
   * 获取当前幻灯片
   */
  getCurrentSlide: () => PresentationSlide;

  /**
   * 切换当前幻灯片
   * @param slideId
   */
  setCurrentSlideIndex: (slideId: string) => void;

  /**
   * 获取幻灯片索引
   * @param slideId
   * @returns
   */
  getSlideIndex: (slideId: string) => number;

  /**
   * 获取幻灯片总数
   */
  getSlidesCount: () => number;

  /**
   * 获取所有幻灯片
   * @returns
   */
  getSlides: () => PresentationSlide[];

  /**
   * 获取指定幻灯片
   * @param slideId
   */
  getSlideById: (slideId: string) => PresentationSlide;

  /**
   * 获取当前选中的幻灯片。
   * 至少存在一个选中的幻灯片。
   * @returns
   */
  getSelectedSlides: () => PresentationSlide[];

  /**
   * 设置选中的幻灯片
   * @param ids
   * @returns
   */
  setSelectedSlides: (ids: string[]) => void;
}
