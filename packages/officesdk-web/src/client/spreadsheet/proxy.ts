import type { RPCClientProxy, RPCReturnMapProxy } from '@officesdk/rpc';

import type { SpreadsheetMethods, SpreadsheetSelection } from '../../shared';

export function createSpreadsheetProxy(): RPCClientProxy<SpreadsheetMethods> {
  return (context) => {
    const { invoke } = context;

    return {
      getWorkbook: async () => {
        return invoke('getWorkbook', []);
      },

      getActiveSheet: async () => {
        return invoke('getActiveSheet', []);
      },

      getActiveCell: async () => {
        return invoke('getActiveCell', []);
      },

      getSelections: async () => {
        // 这里实际返回类型为这个，和类型自动退到出来的不一样
        return invoke('getSelections', []) as Promise<RPCReturnMapProxy<SpreadsheetSelection>[] | null>;
      },

      getContent: async () => {
        return invoke('getContent', []);
      },
    };
  };
}
