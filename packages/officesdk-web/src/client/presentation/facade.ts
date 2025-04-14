import type { Client } from '@officesdk/rpc';
import type { PresentationMethods } from '../../shared';

export interface PresentationFacade {
  // TODO: Implement based on PresentationSDK
}

export function createPresentationFacade(proxy: Client<PresentationMethods>): PresentationFacade {
  return {
    // TODO: Implement based on PresentationSDK
  };
}
