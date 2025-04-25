import type { RPCServerProxy } from '@shimo/officesdk-rpc';

import type { SpreadsheetMethods, SpreadsheetEditor, SpreadsheetSDKOptions } from '../../shared';
import type { EditorContext } from '../editor';
import { createSpreadsheetWorkbookProxy } from './workbook';
import { createSpreadsheetWorksheetProxy } from './worksheet';
import { createSpreadsheetCellProxy } from './cell';
import { createSpreadsheetSelectionProxy } from './selection';
import { createEditorContentProxy } from '../editor/content';

export type SpreadsheetEditorFactory = (options: SpreadsheetSDKOptions | null) => Promise<SpreadsheetEditor>;

export type SpreadsheetContextFactory = (editor: SpreadsheetEditor) => Promise<EditorContext>;

/**
 * 定义电子表格的 RPC 代理的服务端调用接口
 * @returns
 */
export function createSpreadsheetProxy(
  createEditor: SpreadsheetEditorFactory,
  createContext?: SpreadsheetContextFactory,
): RPCServerProxy<SpreadsheetMethods, SpreadsheetSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    console.log('context', context);

    return {
      /**
       * 获取工作簿接口
       */
      getWorkbook: () => {
        return createSpreadsheetWorkbookProxy(editor.workbook);
      },

      /**
       * 获取当前活跃工作表对象
       */
      getActiveSheet: () => {
        return createSpreadsheetWorksheetProxy(editor.activeSheet);
      },

      /**
       * 获取当前活动单元格
       */
      getActiveCell: () => {
        const cell = editor.activeCell;
        if (!cell) {
          return null;
        }
        return createSpreadsheetCellProxy(cell);
      },

      /**
       * 获取表格选区接口
       */
      getSelections: () => {
        const selections = editor.selections;
        if (!selections) {
          return null;
        }
        return selections.map((selection) => createSpreadsheetSelectionProxy(selection));
      },

      /**
       * 获取内容接口
       */
      getContent: () => {
        if (!context?.content) {
          throw new Error('Context content is not provided');
        }

        return createEditorContentProxy(context.content);
      },
    };
  };
}
