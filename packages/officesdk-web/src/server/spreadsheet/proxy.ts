import type { RPCServerProxy } from '@officesdk/rpc';

import type { SpreadsheetMethods, SpreadsheetEditor } from '../../shared';
import type { EditorContext } from '../editor';

/**
 * 定义电子表格的 RPC 代理的服务端调用接口
 * @returns
 */
export function createSpreadsheetProxy(
  editor: SpreadsheetEditor,
  context: EditorContext,
): RPCServerProxy<SpreadsheetMethods> {
  return () => {
    return {
      getWorkbook: () => {
        return editor.workbook;
      },
      getActiveSheet: () => {
        return editor.activeSheet;
      },
      getActiveCell: () => {
        return editor.activeCell;
      },
      getSelections: () => {
        return editor.selections;
      },
      getContent: () => {
        return context.content;
      },
    };
  };
}
