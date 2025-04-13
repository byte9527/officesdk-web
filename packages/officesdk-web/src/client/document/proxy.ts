import type { RPCClientProxy } from '@officesdk/rpc';
import type { DocumentSDK } from '../../shared';

export function createDocumentProxy(): RPCClientProxy<DocumentSDK> {
  return (context) => {
    const { invoke } = context;

    return {
      getSelection: async () => {
        throw new Error('Not implemented');
      },
    };
  };
}
