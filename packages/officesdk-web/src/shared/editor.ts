/**
 * 编辑器模式
 * - `standard` 标准模式，会根据用户权限配置不同的功能
 * - `preview` 预览模式，只能查看内容
 */
export enum EditorModeType {
  Standard = 'standard',
  Preview = 'preview'
}

/**
 * 编辑器在 `standard` 模式下的权限模式
 * - `editor` 编辑模式
 * - `viewer` 阅读模式
 * - `reviewer` 评论模式
 */
export enum EditorStandardRole {
  Editor = 'editor',
  Viewer = 'viewer',
  Reviewer = 'reviewer'
}

export type EditorContentMethods = {
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

export type EditorOutlineMethods<Content> = {
  getOutline: () => EditorOutline<Content>;
};

/**
 * 通用目录接口
 * @method getContent 获取目录信息
 * @method addContentChangedListener 添加目录信息改变时的监听器
 */
export declare interface EditorOutline<Content = unknown> {
  /**
   * 获取目录信息
   * @returns 目录信息
   */
  getContent: () => Promise<EditorOutlineItem<Content>[]>;
  /**
   * 添加目录信息改变时的监听器
   * @param listener 监听器
   * @returns 取消监听器的函数
   */
  addChangedListener: (listener: (content: EditorOutlineItem<Content>[]) => void) => () => void;
  /**
   * 跳转到指定条目对应的正文位置
   * @param id 条目id
   * @returns 跳转是否成功
   */
  goto: (id: string) => Promise<boolean>;
}

/**
 * 通用目录项条目
 * @field id 目录项 ID
 * @field level 目录项层级
 * @field content 目录项内容
 */
export declare interface EditorOutlineItem<Content = unknown> {
  /**
   * 目录项 ID
   */
  id: string;
  /**
   * 目录项层级
   */
  level: number;
  /**
   * 目录项内容
   */
  content: Content;
}
