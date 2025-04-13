/**
 * Document SDK 的类型定义，
 * 作为契约，用于统一约束客户端和服务端的接口。
 * 这里只有类型定义，不包含任何实现。
 */

export type DocumentSDK = {
  /**
   * 选区实例
   */
  getSelection: () => DocumentSelection;

  /**
   * 主动保存内容
   */
  getContent: () => DocumentContent;

  // TODO: 初始化流程控制，初始化各类异常
};

export interface DocumentContent {
  /**
   * 主动保存内容
   */
  save: () => void;

  // TODO: 发生变化

  addContentListener: (listener: (record: DocumentContentRecord) => void) => void;
}

/**
 * 每次内容发生变化时，会生成一个当前页面唯一的记录。
 */
export interface DocumentContentRecord {
  /**
   * 生成内容的时间戳
   */
  timestamp: number;

  /**
   * 内容标识
   */
  id: string;
}

export interface DocumentSelection {
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
  addRangeListener: (listener: (range: DocumentRange) => void) => void;
}

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
  start: number;
  end: number;
}
