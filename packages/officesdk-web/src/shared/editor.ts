export type EditorMethods = {
  getContent: () => EditorContent;
};

/**
 * 编辑器内容接口
 */
export type EditorContent = {
  /**
   * 主动保存内容
   */
  save: () => void;

  /**
   * 文件内容发生变化时触发回调
   * @param listener
   * @returns
   */
  addContentListener: (listener: (record: EditorContentRecord) => void) => void;
};

/**
 * 每次内容发生变化时，会生成一个当前页面唯一的记录。
 */
export interface EditorContentRecord {
  /**
   * 生成内容的时间戳
   */
  timestamp: number;

  /**
   * 内容标识
   */
  id: string;
}
