import type { RPCServerProxy } from '@officesdk/rpc';

import type { DocumentMethods, DocumentEditor } from '../../shared';
import type { EditorContext } from '../editor';
/**
 * 定义 Document 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createDocumentProxy(editor: DocumentEditor, context: EditorContext): RPCServerProxy<DocumentMethods> {
  return () => {
    return {
      getSelection: () => {
        return {
          value: editor.selection,
          rules: [
            {
              type: 'any',
            },
          ],
        };
      },

      getContent: () => {
        return {
          value: context.content,
          rules: [
            {
              type: 'any',
            },
          ],
        };
      },
    };
  };
}
