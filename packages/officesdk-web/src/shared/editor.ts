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

/**
 * 菜单栏相关配置，目前菜单栏不是所有套件都支持，
 * 菜单栏是指的编辑器最上放可以展开二级菜单的那一栏。
 */
export interface EditorMenuOptions<TName extends string> {
  /**
   * 菜单栏是否显示
   */
  visible?: boolean;

  /**
   * 是否禁用菜单栏所有功能
   */
  disabled?: boolean;

  /**
   * 菜单栏一级菜单配置
   */
  entries?: EditorMenuEntryConfig<TName>[];

  /**
   * 菜单栏功能按钮配置
   */
  features?: Partial<EditorMenuFeatureButtonConfig<TName>>;

  /**
   * 自定义按钮配置
   */
  custom?: EditorMenuCustomButton[];
}

/**
 * 菜单栏按钮配置
 */
export type EditorMenuFeatureButtonConfig<TName extends string> = Record<TName, EditorMenuFeatureButton<TName>>;

/**
 * 菜单栏一级菜单配置，此处用于定义一级菜单的操作入口，
 * 一级菜单在鼠标悬停时展示二级列表
 */
export interface EditorMenuEntryConfig<TName extends string> {
  /**
   * 一级菜单名称
   */
  name: string;
  /**
   * 二级菜单定义，定一个二维数组，用于定义二级菜单的结构，
   * 将第一层数组中的所有按钮放到一个区域内用分隔符隔开，
   * 第二层数组为按钮的定义，可以是功能按钮也可以是一个下拉入口。
   */
  children: Array<EditorMenuFeatureButton<TName> | EditorMenuEntryButton>[];
}

/**
 * 菜单栏功能按钮配置
 */
export type EditorMenuFeatureButton<TName extends string> =
  | {
      /**
       * 隐藏按钮，用作在需要隐藏菜单栏时定义
       */
      type: 'hidden';
      /**
       * 按钮名称
       */
      name: TName;
    }
  | {
      type: 'button';
      /**
       * 按钮名称
       */
      name: TName;
      /**
       * 按钮标签（显示文本）
       */
      label: string;
      /**
       * 按钮图标，可以是 base64 的图片信息，也可以是图片 url
       */
      icon?: string;
    };

/**
 * 菜单栏二级以下的菜单入口
 */
export interface EditorMenuEntryButton {
  type: 'entry';

  /**
   * 菜单名称
   */
  name: string;

  /**
   * 菜单图标
   */
  icon?: string;
}

/**
 * 菜单栏自定义按钮配置
 */
export type EditorMenuCustomButton =
  | {
      /**
       * 按钮名称
       */
      name: string;
      /**
       * 链接
       */
      type: 'link';
      /**
       * 按钮文本
       */
      text: string;
      /**
       * 链接地址
       */
      url: string;
    }
  | {
      /**
       * 按钮名称
       */
      name: string;
      /**
       * 按钮，点击后触发 callback 回调
       */
      type: 'button';
      /**
       * 按钮文本
       */
      label: string;
      /**
       * 按钮图标，可以是 base64 的图片信息，也可以是图片 url
       */
      icon?: string;
      /**
       * 按钮点击事件
       */
      callback: () => void;
    };
