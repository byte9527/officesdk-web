import type { RPCServerProxy } from '@officesdk/rpc';
import type { DocumentMethods, DocumentEditor } from '../../shared';

/**
 * 定义 Document 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createDocumentProxy(editor: DocumentEditor): RPCServerProxy<DocumentMethods> {
  return () => {
    return {
      getSelection: () => {
        throw new Error('Not implemented');
      },

      getContent: () => {
        throw new Error('Not implemented');
      },
    };
  };
}
