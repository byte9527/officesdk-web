import type { RPCServerProxy } from '@officesdk/rpc';
import type { PdfMethods, PdfEditor } from '../../shared';
import { createPdfPagesProxy } from './pages';
import { createPdfSelectionProxy } from './selection';
import { createPdfOutlineProxy } from './outline';

/**
 * 定义 PDF 的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPdfProxy(editor: PdfEditor): RPCServerProxy<PdfMethods> {
  return () => {
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
