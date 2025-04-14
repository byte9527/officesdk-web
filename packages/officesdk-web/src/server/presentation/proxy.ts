import type { RPCServerProxy } from '@officesdk/rpc';
import type { PresentationMethods, PresentationEditor } from '../../shared';

/**
 * 定义幻灯片的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPresentationProxy(editor: PresentationEditor): RPCServerProxy<PresentationMethods> {
  return () => {
    return {};
  };
}
