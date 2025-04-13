import type { RPCClientProxy } from '@officesdk/rpc';
import type { DatabaseTableSDK } from '../../shared';

export function createDatabaseTableProxy(): RPCClientProxy<DatabaseTableSDK> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
