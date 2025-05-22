import type { EditorContent } from './editor';
import type { EditorMenuOptions, EditorMenuFeatureButtonConfig, EditorMenuEntryConfig } from '../shared';
/**
 * Spreadsheet 远程调用的方法定义，
 * 作为契约，用于统一约束客户端和服务端的接口。
 * 这里只有类型定义，不包含任何实现。
 */
export type SpreadsheetMethods = {
  /**
   * 获取工作簿接口
   */
  getWorkbook: () => SpreadsheetWorkbook;

  /**
   * 获取当前活跃工作表对象
   */
  getActiveSheet: () => SpreadsheetWorksheet;

  /**
   * 获取当前活动单元格
   */
  getActiveCell: () => SpreadsheetCell | null;

  /**
   * 获取表格选区接口
   */
  getSelections: () => SpreadsheetSelection[] | null;

  /**
   * 获取内容接口
   */
  getContent: () => EditorContent;
};

/**
 * 电子表格编辑器实例接口
 */
export interface SpreadsheetEditor {
  readonly workbook: SpreadsheetWorkbook;
  readonly activeSheet: SpreadsheetWorksheet;
  readonly activeCell: SpreadsheetCell | null;
  readonly selections: SpreadsheetSelection[] | null;
}

/**
 * 工作簿接口
 */
export type SpreadsheetWorkbook = {
  /**
   * 获取所有工作表
   */
  getWorksheets: () => SpreadsheetWorksheet[];

  /**
   * 获取指定的工作表
   * @param sheetId 工作表ID
   */
  getWorksheetById: (sheetId: string) => SpreadsheetWorksheet | null;

  /**
   * 获取当前活动的工作表
   */
  getActiveWorksheet: () => SpreadsheetWorksheet;

  /**
   * 激活指定的工作表
   * @param sheetId 工作表ID
   */
  setActiveWorksheet: (sheetId: string) => void;
};

/**
 * 工作表对象
 */
export type SpreadsheetWorksheet = {
  /**
   * 工作表对应编号
   */
  readonly id: string;

  /**
   * 工作表名称
   */
  readonly name: string;

  /**
   * 是否为当前活动的工作表
   */
  readonly isActive: boolean;

  /**
   * 获取工作表的所有选区
   */
  getSelections: () => SpreadsheetSelection[] | null;

  /**
   * 获取选区的物理位置（相对于浏览器窗口）
   * @param range 选区范围
   */
  getPhysicalPosition: (range: SpreadsheetRangeValue) => {
    left: number;
    top: number;
    width: number;
    height: number;
  } | null;

  /**
   * 添加选区变化监听器
   * @param listener 监听函数
   */
  addRangeListener: (
    listener: (range: { sheet: string; ranges: SpreadsheetRangeValue[] | null }) => void,
  ) => () => void;

  /**
   * 获取工作表中指定区域的单元格对象
   * @param row 行号
   * @param column 列号
   */
  getCell: (row: number, column: number) => SpreadsheetCell | null;

  /**
   * 获取工作表中选中的单元格对象
   */
  getActiveCell: () => SpreadsheetCell | null;

  /**
   * 激活工作表中某个单元格
   * @param cell 单元格位置信息
   */
  setActiveCell: (cell: { row: number; column: number }) => void;

  /**
   * 定位到单元格所在位置
   * @param row 单元格所在行
   * @param column 单元格所在列
   */
  locateCell: (row: number, column: number) => void;
};

/**
 * 表格单元格对象
 */
export type SpreadsheetCell = {
  /**
   * 单元格所在的行号
   */
  readonly row: number;

  /**
   * 单元格所在的列号
   */
  readonly column: number;

  /**
   * 单元格所在的工作表 ID
   */
  readonly sheetId: string;

  /**
   * 获取单元格的文本
   */
  getCellText: () => string;

  /**
   * 获取单元格的值
   */
  getCellValue: () => SpreadsheetCellValue | null;
};

/**
 * 单元格值类型
 */
export type SpreadsheetCellValue =
  | {
      type: 'primitive';
      value: string | number | boolean;
    }
  | {
      type: 'date';
      value: number;
    }
  | {
      type: 'calcError';
      value: {
        error: string;
      };
    };

/**
 * 选区类型
 */
export enum SpreadsheetRangeType {
  /**
   * 选中一个或多个单元格
   */
  Cells = 'cells',

  /**
   * 选中一行或多行
   */
  Rows = 'rows',

  /**
   * 选中一列或多列
   */
  Columns = 'columns',

  /**
   * 选中整个工作表
   */
  Sheet = 'sheet',
}

/**
 * 表格区域对象
 */
export interface SpreadsheetRange {
  /**
   * 区域类型
   */
  readonly type: `${SpreadsheetRangeType}`;

  /**
   * 区域的行开始位置
   */
  readonly row: number;

  /**
   * 区域的列开始位置
   */
  readonly column: number;

  /**
   * 区域的行数
   */
  readonly rowCount: number;

  /**
   * 区域的列数
   */
  readonly columnCount: number;

  /**
   * 获取该区域对应的纯文本信息
   */
  getText: () => string;

  /**
   * 设置该区域的内容
   * @param text 内容
   */
  setText: (text: string) => void;

  /**
   * 将区域中的内容以 HTML 格式返回
   */
  getHtml: () => string;

  /**
   * 设置该区域的内容为 HTML 格式
   * @param html 内容
   */
  setHtml: (html: string) => void;
}

/**
 * 可用于描述一个表格选区的信息
 */
export type SpreadsheetRangeValue =
  | {
      /**
       * 单个或多个单元格
       */
      type: `${SpreadsheetRangeType.Cells}`;
      /**
       * 起始单元格的行号
       */
      row: number;
      /**
       * 总计行数
       */
      rowCount: number;
      /**
       * 起始单元格的列号
       */
      column: number;
      /**
       * 总计列数
       */
      columnCount: number;
    }
  | {
      /**
       * 一列或多列
       */
      type: `${SpreadsheetRangeType.Rows}`;
      /**
       * 起始行号
       */
      row: number;
      /**
       * 总计行数
       */
      rowCount: number;
    }
  | {
      /**
       * 一行或多行
       */
      type: `${SpreadsheetRangeType.Columns}`;
      /**
       * 起始列号
       */
      column: number;
      /**
       * 总计列数
       */
      columnCount: number;
    }
  | {
      /**
       * 整个工作表
       */
      type: `${SpreadsheetRangeType.Sheet}`;
    };

/**
 * 表格选区接口
 */
export type SpreadsheetSelection = {
  /**
   * 获取选区的区域范围
   * @param value 可选的选区值
   */
  getRange: (value?: SpreadsheetRangeValue) => SpreadsheetRange | null;

  /**
   * 设置选区的区域范围
   * @param value 选区的区域范围或null
   */
  setRange: (value: SpreadsheetRangeValue | null) => void;
};

/**
 * 幻灯片工具栏内置功能按钮
 */
export type SpreadsheetMenuFeatureButtonName = 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll';

/**
 * 幻灯片工具栏一级菜单
 */
export type SpreadsheetMenuEntryConfig = EditorMenuEntryConfig<SpreadsheetMenuFeatureButtonName>;

/**
 * 幻灯片工具栏功能按钮
 */
export type SpreadsheetMenuFeatureButtonConfig = EditorMenuFeatureButtonConfig<SpreadsheetMenuFeatureButtonName>;

export interface SpreadsheetSDKOptions {
  // TODO:
  /**
     * 菜单栏相关设置
     */
    menu?: SpreadsheetMenuOptions;
}

export type SpreadsheetMenuOptions = EditorMenuOptions<SpreadsheetMenuFeatureButtonName>;
