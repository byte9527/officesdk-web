import type { RPCClientProxy } from '@officesdk/rpc';

import type { SpreadsheetMethods } from '../../shared';

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
        return invoke('getSelections', []);
      },

      getContent: async () => {
        return invoke('getContent', []);
      },
    };
  };
}
