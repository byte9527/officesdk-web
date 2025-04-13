import type { RPCClientProxy } from '@officesdk/rpc';
import type { SpreadsheetSDK } from '../../shared';

export function createSpreadsheetProxy(): RPCClientProxy<SpreadsheetSDK> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
