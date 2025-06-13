import type { RPCServerProxy } from '@officesdk/rpc';

import type { EditorContext } from '../editor';
import type { DatabaseTableMethods, DatabaseTableEditor, DatabaseTableSDKOptions } from '../../shared';
import { createEditorContentProxy } from '../editor/content';
import { createDatabaseTableSheetProxy } from './worksheet';
import { createDatabaseTableSelectionProxy } from './selection';

export type DatabaseTableEditorFactory = (options: DatabaseTableSDKOptions | null) => Promise<DatabaseTableEditor>;

export type DatabaseTableContextFactory = (editor: DatabaseTableEditor) => Promise<EditorContext>;

/**
 * 定义数据表的 RPC 代理的服务端调用接口
 * @returns
 */
export function createDatabaseTableProxy(
  createEditor: DatabaseTableEditorFactory,
  createContext?: DatabaseTableContextFactory,
): RPCServerProxy<DatabaseTableMethods, DatabaseTableSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    return {
      getActiveDBSheet: () => {
        return createDatabaseTableSheetProxy(editor.activeDBTable);
      },

      getDBTableSelection: () => {
        return createDatabaseTableSelectionProxy(editor.selection);
      },

      getContent: () => {
        if (!context?.content) {
          throw new Error('Context content is not provided');
        }
        return createEditorContentProxy(context.content);
      },
    };
  };
}
