import type { RPCClientProxy } from '@officesdk/rpc';
import type { DatabaseTableMethods } from '../../shared';

export function createDatabaseTableProxy(): RPCClientProxy<DatabaseTableMethods> {
  return (context) => {
    const { invoke } = context;

    return {
      getActiveDBSheet: async () => {
        return invoke('getActiveDBSheet', []);
      },

      getDBTableSelection: async () => {
        return invoke('getDBTableSelection', []);
      },

      getContent: async () => {
        return invoke('getContent', []);
      },
    };
  };
}
