import type { RPCClientProxy } from '@officesdk/rpc';
import type { LiteDocSDK } from '../../shared';

export function createLiteDocProxy(): RPCClientProxy<LiteDocSDK> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
