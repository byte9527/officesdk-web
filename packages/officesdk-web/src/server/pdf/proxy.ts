import type { RPCServerProxy } from '@officesdk/rpc';
import type { PdfMethods, PdfEditor } from '../../shared';

/**
 * 定义 PDF 的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPdfProxy(editor: PdfEditor): RPCServerProxy<PdfMethods> {
  return () => {
    return {
      getPages: () => {
        return editor.pages;
      },

      getSelection: () => {
        return editor.selection;
      },

      getOutline: () => {
        return editor.outline;
      },
    };
  };
}
