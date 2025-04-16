import type { Client } from '@officesdk/rpc';
import type {
  SpreadsheetMethods,
  SpreadsheetWorkbook,
  SpreadsheetWorksheet,
  SpreadsheetCell,
  SpreadsheetSelection,
  EditorContent,
  RpcReturnProxy,
} from '../../shared';
import { createWorkbookFacade } from './workbook';
import { createWorksheetFacade } from './worksheet';
import type { WorksheetFacade } from './worksheet';
import { createContentFacade } from './content';

export interface SpreadsheetFacade {
  /**
   * 工作簿实例
   */
  readonly workbook: RpcReturnProxy<SpreadsheetWorkbook>;

  /**
   * 当前活跃工作表
   */
  readonly activeSheet: Promise<WorksheetFacade>;

  /**
   * 当前活动单元格
   */
  readonly activeCell: Promise<SpreadsheetCell | null>;

  /**
   * 当前选区
   */
  readonly selections: Promise<SpreadsheetSelection[] | null>;

  /**
   * 内容接口
   */
  readonly content: ReturnType<typeof createContentFacade>;
}

export function createSpreadsheetFacade(proxy: Client<SpreadsheetMethods>): SpreadsheetFacade {
  const { methods } = proxy;
  const workbook = createWorkbookFacade(methods);
  const activeSheet = createWorksheetFacade(methods);
  const content = createContentFacade(methods);

  return {
    get workbook() {
      return workbook;
    },
    get activeSheet() {
      return activeSheet;
    },
    get activeCell() {
      return methods.getActiveCell();
    },
    get selections() {
      return methods.getSelections();
    },
    get content() {
      return content;
    },
  };
}
