import { Token } from '@officesdk/rpc';
import type { RPCServerProxy } from '@officesdk/rpc';

import type { DocumentMethods, DocumentEditor } from '../../shared';
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
        return new Token(proxySelection(editor.selection), {
          rules: [
            {
              type: 'callback',
              path: '&addRangeListener',
            },
            {
              type: 'callback',
              path: '&getRange',
            },
            {
              type: 'callback',
              path: '&setRange',
            },
          ],
        });
      },

      getContent: () => {
        return new Token(context.content, {
          rules: [
            {
              type: 'callback',
              path: '&save',
            },
            {
              type: 'callback',
              path: '&addContentListener',
            },
          ],
        });
      },
    };
  };
}
