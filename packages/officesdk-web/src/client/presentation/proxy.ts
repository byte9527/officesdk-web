import type { RPCClientProxy } from '@officesdk/rpc';
import type { PresentationMethods } from '../../shared';

export function createPresentationProxy(): RPCClientProxy<PresentationMethods> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
