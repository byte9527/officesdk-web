import type { Client, RPCReturnMapProxy } from '@officesdk/rpc';
import type {
  SpreadsheetMethods,
  SpreadsheetWorkbook,
  SpreadsheetCell,
  SpreadsheetSelection,
  SpreadsheetWorksheet,
} from '../../shared';
import { createWorkbookFacade } from './workbook';
import { createContentFacade } from '../editor/content';

export interface SpreadsheetFacade {
  /**
   * 工作簿实例
   */
  readonly workbook: RPCReturnMapProxy<SpreadsheetWorkbook>;

  /**
   * 当前活跃工作表
   */
  readonly activeSheet: Promise<RPCReturnMapProxy<SpreadsheetWorksheet>>;

  /**
   * 当前活动单元格
   */
  readonly activeCell: Promise<RPCReturnMapProxy<SpreadsheetCell> | null>;

  /**
   * 当前选区
   */
  readonly selections: Promise<RPCReturnMapProxy<SpreadsheetSelection>[] | null>;

  /**
   * 内容接口
   */
  readonly content: ReturnType<typeof createContentFacade>;
}

export function createSpreadsheetFacade(proxy: Client<SpreadsheetMethods>): SpreadsheetFacade {
  const { methods } = proxy;

  // 下面是单例的实例，再额外包装一层
  const workbook = createWorkbookFacade(methods);
  const content = createContentFacade(methods);

  return {
    get workbook() {
      return workbook;
    },
    get activeCell() {
      return methods.getActiveCell();
    },
    get selections() {
      return methods.getSelections();
    },
    get activeSheet() {
      return methods.getActiveSheet();
    },
    get content() {
      return content;
    },
  };
}
