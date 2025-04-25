import type { RPCServerProxy } from '@shimo/officesdk-rpc';

import type { DocumentMethods, DocumentEditor, DocumentSDKOptions } from '../../shared';
import type { EditorContext } from '../editor';
import { createDocumentSelectionProxy } from './selection';
import { createEditorContentProxy } from '../editor/content';
import { createDocumentZoomProxy } from './zoom';
import { createDocumentTOCsProxy } from './tocs';
import { createDocumentOutlineProxy } from './outline';

export type DocumentEditorFactory = (options: DocumentSDKOptions | null) => Promise<DocumentEditor>;

export type DocumentContextFactory = (editor: DocumentEditor) => Promise<EditorContext>;

/**
 * 定义 Document 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createDocumentProxy(
  createEditor: DocumentEditorFactory,
  createContext?: DocumentContextFactory,
): RPCServerProxy<DocumentMethods, DocumentSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    return {
      getSelection: () => {
        return createDocumentSelectionProxy(editor.selection);
      },

      getContent: () => {
        if (!context?.content) {
          throw new Error('Context content is not provided');
        }

        return createEditorContentProxy(context.content);
      },

      getZoom: () => {
        return createDocumentZoomProxy(editor.zoom);
      },

      getTOCs: () => {
        return createDocumentTOCsProxy(editor.TOCs);
      },

      getOutline: () => {
        return createDocumentOutlineProxy(editor.outline);
      },
    };
  };
}
