import type { EditorContent } from './editor';
/**
 * Document 远程调用的方法定义，
 * 作为契约，用于统一约束客户端和服务端的接口。
 * 这里只有类型定义，不包含任何实现。
 */

export type DocumentMethods = {
  /**
   * 获取选区接口
   */
  getSelection: () => DocumentSelection;

  /**
   * 获取内容接口
   */
  getContent: () => EditorContent;

  /**
   * 获取当前文档的缩放接口
   */
  getZoom: () => DocumentZoom;
  // TODO: 初始化流程控制，初始化各类异常
};

/**
 * 文档编辑器实例接口
 */
export interface DocumentEditor {
  readonly selection: DocumentSelection;
  readonly content: EditorContent;
  readonly zoom: DocumentZoom;
}

export type DocumentSelection = {
  /**
   * 获取选区的区域范围，
   * 如果选区不存在，则返回 null。
   * @returns
   */
  getRange: () => DocumentRange | null;

  /**
   * 设置选区的区域范围，
   * 设置后，选区会自动选中指定范围。
   * 如果设置为 null，则清空选区。
   * @param value 选区的区域范围
   */
  setRange: (range: DocumentRangeValue | null) => void;

  /**
   * 添加选区变化监听器，当选区发生变化时，会触发回调。
   * @param listener
   * @returns
   */
  addRangeListener: (listener: (range: DocumentRangeValue) => void) => void;
};

/**
 * 文档区域接口
 */
export interface DocumentRange {
  /**
   * 区域的开始位置，
   * 当文档发生变化后，区域的标识可能会失效。
   */
  readonly start: string;

  /**
   * 区域的结束位置，
   * 当文档发生变化后，区域的标识可能会失效。
   */
  readonly end: string;

  /**
   * 是否为光标。
   */
  readonly isCaret: boolean;

  /**
   * 获取该区域对应的纯文本信息。
   * @returns 返回纯文本字符串
   */
  getText: () => string;

  /**
   * 将区域内的文本设置为指定的文本，
   * 如果文本为空，则清空区域内的文本。
   * 如果区域为
   * @param text
   */
  setText: (text: string) => void;

  /**
   * 将区域中的内容以 HTML 格式返回。
   * @returns 返回 HTML 字符串
   */
  getHtml: () => string;
  /**
   * 将区域内的文本设置为指定的 HTML 内容，
   * 如果内容为空，则清空区域内的内容。
   * 如果区域为光标，则会将光标位置的文本替换为指定的 HTML 格式。
   * @param html 指定的 HTML 内容
   */
  setHtml: (html: string) => void;
}

/**
 * 可用于描述一个文档区域的信息。
 */
export interface DocumentRangeValue {
  start: string;
  end: string;
}

/**
 * 文档缩放接口
 */
export type DocumentZoom = {
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
   * page: 根据页面尺寸自动缩放，将页面缩放到可以完整显示的大小
   * @param mode 缩放模式，可以是 'window' 或 'page'
   */
  setFitMode: (mode: 'none' | 'window' | 'page') => void;
  /**
   * 获取当前缩放模式。
   * @returns
   */
  getFitMode: () => 'none' | 'window' | 'page';
  /**
   * 放大。
   */
  zoomIn: () => void;
  /**
   * 缩小。
   */
  zoomOut: () => void;
};
