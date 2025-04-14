import type { RPCServerProxy } from '@officesdk/rpc';
import type { LiteDocMethods, LiteDocEditor } from '../../shared';

/**
 * 定义轻文档的 RPC 代理的服务端调用接口
 * @returns
 */
export function createLiteDocProxy(editor: LiteDocEditor): RPCServerProxy<LiteDocMethods> {
  return () => {
    return {};
  };
}
