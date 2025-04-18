import type { RPCServerProxy } from '@officesdk/rpc';

import type { DocumentMethods, DocumentEditor } from '../../shared';
import type { EditorContext } from '../editor';
import { createDocumentSelectionProxy } from './selection';
import { createEditorContentProxy } from '../editor/content';
import { createDocumentZoomProxy } from './zoom';

/**
 * 定义 Document 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createDocumentProxy(editor: DocumentEditor, context: EditorContext): RPCServerProxy<DocumentMethods> {
  return () => {
    return {
      getSelection: () => {
        return createDocumentSelectionProxy(editor.selection);
      },

      getContent: () => {
        return createEditorContentProxy(context.content);
      },

      getZoom: () => {
        return createDocumentZoomProxy(editor.zoom);
      },
    };
  };
}
