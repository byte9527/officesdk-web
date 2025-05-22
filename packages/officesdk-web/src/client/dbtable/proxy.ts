import type { RPCClientProxy } from '@officesdk/rpc';
import type { DatabaseTableMethods } from '../../shared';

export function createDatabaseTableProxy(): RPCClientProxy<DatabaseTableMethods> {
  return (context) => {
    // const { invoke } = context;

    return {
      // ready: () => Promise.resolve(),
    };
  };
}
