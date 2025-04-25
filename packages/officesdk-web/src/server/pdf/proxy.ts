import type { RPCServerProxy } from '@shimo/officesdk-rpc';
import type { PdfMethods, PdfEditor, PdfSDKOptions } from '../../shared';
import { createPdfPagesProxy } from './pages';
import { createPdfSelectionProxy } from './selection';
import { createPdfOutlineProxy } from './outline';
import type { EditorContext } from '../editor';
export type PdfEditorFactory = (options: PdfSDKOptions | null) => Promise<PdfEditor>;

export type PdfContextFactory = (editor: PdfEditor) => Promise<EditorContext>;

/**
 * 定义 PDF 的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPdfProxy(
  createEditor: PdfEditorFactory,
  createContext?: PdfContextFactory,
): RPCServerProxy<PdfMethods, PdfSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    console.log('context', context);

    return {
      /**
       * 获取页面操作接口
       */
      getPages: () => {
        return createPdfPagesProxy(editor.pages);
      },

      /**
       * 获取选区接口
       */
      getSelection: () => {
        return createPdfSelectionProxy(editor.selection);
      },

      /**
       * 获取目录接口
       */
      getOutline: () => {
        return createPdfOutlineProxy(editor.outline);
      },
    };
  };
}
