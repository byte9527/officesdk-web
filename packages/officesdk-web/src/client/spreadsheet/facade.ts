import type { Client } from '@officesdk/rpc';
import type { SpreadsheetMethods } from '../../shared';

export interface SpreadsheetFacade {
  // TODO: Implement based on SpreadsheetSDK
}

export function createSpreadsheetFacade(proxy: Client<SpreadsheetMethods>): SpreadsheetFacade {
  return {
    // TODO: Implement based on SpreadsheetSDK
  };
}
