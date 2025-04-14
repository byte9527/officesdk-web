import type { RPCServerProxy } from '@officesdk/rpc';
import type { SpreadsheetMethods, SpreadsheetEditor } from '../../shared';

/**
 * 定义电子表格的 RPC 代理的服务端调用接口
 * @returns
 */
export function createSpreadsheetProxy(editor: SpreadsheetEditor): RPCServerProxy<SpreadsheetMethods> {
  return () => {
    return {};
  };
}
