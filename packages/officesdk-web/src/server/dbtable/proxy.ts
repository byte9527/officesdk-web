import type { RPCServerProxy } from '@shimo/officesdk-rpc';

import type { EditorContext } from '../editor';
import type { DatabaseTableMethods, DatabaseTableEditor, DatabaseTableSDKOptions } from '../../shared';

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

    console.log('context', context);
    return {};
  };
}
