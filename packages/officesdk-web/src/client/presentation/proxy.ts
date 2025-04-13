import type { RPCClientProxy } from '@officesdk/rpc';
import type { PresentationSDK } from '../../shared';

export function createPresentationProxy(): RPCClientProxy<PresentationSDK> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
