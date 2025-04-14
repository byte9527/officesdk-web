import type { RPCServerProxy } from '@officesdk/rpc';
import type { DatabaseTableMethods, DatabaseTableEditor } from '../../shared';

/**
 * 定义数据表的 RPC 代理的服务端调用接口
 * @returns
 */
export function createDatabaseTableProxy(editor: DatabaseTableEditor): RPCServerProxy<DatabaseTableMethods> {
  return () => {
    return {};
  };
}
