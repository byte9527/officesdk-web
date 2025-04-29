import type { RPCClientProxy } from '@officesdk/rpc';
import type { LiteDocMethods } from '../../shared';

export function createLiteDocProxy(): RPCClientProxy<LiteDocMethods> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
