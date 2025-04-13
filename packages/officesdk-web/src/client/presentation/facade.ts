import type { RPCClientProxy } from '@officesdk/rpc';
import type { PresentationSDK } from '../../shared';

export interface PresentationFacade {
  // TODO: Implement based on PresentationSDK
}

export function createPresentationFacade(proxy: RPCClientProxy<PresentationSDK>): PresentationFacade {
  return {
    // TODO: Implement based on PresentationSDK
  };
}
