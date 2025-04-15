import type { RPCServerProxy } from '@officesdk/rpc';

import type { DocumentMethods, DocumentEditor } from '../../shared';
import { proxyContent } from '../editor';
import type { EditorContext } from '../editor';
import { proxySelection } from './selection';

/**
 * 定义 Document 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createDocumentProxy(editor: DocumentEditor, context: EditorContext): RPCServerProxy<DocumentMethods> {
  return () => {
    return {
      getSelection: () => {
        return proxySelection(editor.selection);
      },

      getContent: () => {
        return proxyContent(context.content);
      },
    };
  };
}
