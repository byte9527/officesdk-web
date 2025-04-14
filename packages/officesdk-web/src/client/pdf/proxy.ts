import type { RPCClientProxy } from '@officesdk/rpc';
import type { PdfMethods } from '../../shared';

export function createPdfProxy(): RPCClientProxy<PdfMethods> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
