import type { RPCClientProxy } from '@shimo/officesdk-rpc';
import type { PdfMethods } from '../../shared';

/**
 * 定义 PDF 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createPdfProxy(): RPCClientProxy<PdfMethods> {
  return (context) => {
    const { invoke } = context;

    return {
      getPages: async () => {
        return invoke('getPages', []);
      },

      getSelection: async () => {
        return invoke('getSelection', []);
      },

      getOutline: async () => {
        return invoke('getOutline', []);
      },
    };
  };
}
