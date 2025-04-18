import type { RPCReturnMethods, RPCReturnMapProxy } from '@shimo/officesdk-rpc';

import type { SpreadsheetMethods, SpreadsheetWorkbook, SpreadsheetWorksheet } from '../../shared';

export function createWorkbookFacade(
  methods: RPCReturnMethods<SpreadsheetMethods>,
): RPCReturnMapProxy<SpreadsheetWorkbook> {
  let workbookCache: Promise<RPCReturnMapProxy<SpreadsheetWorkbook>> | null = null;

  // workbook 是全局单例，所以可以缓存
  const getWorkbook = async (): Promise<RPCReturnMapProxy<SpreadsheetWorkbook>> => {
    if (workbookCache) {
      return workbookCache;
    }

    workbookCache = methods.getWorkbook();
    return workbookCache;
  };

  return {
    getWorksheets: async (): Promise<RPCReturnMapProxy<SpreadsheetWorksheet>[]> => {
      const workbook = await getWorkbook();
      return workbook.getWorksheets();
    },

    getWorksheetById: async (sheetId: string): Promise<RPCReturnMapProxy<SpreadsheetWorksheet> | null> => {
      const workbook = await getWorkbook();
      return workbook.getWorksheetById(sheetId);
    },

    getActiveWorksheet: async (): Promise<RPCReturnMapProxy<SpreadsheetWorksheet>> => {
      const workbook = await getWorkbook();
      return workbook.getActiveWorksheet();
    },

    setActiveWorksheet: async (sheetId: string): Promise<void> => {
      const workbook = await getWorkbook();
      return workbook.setActiveWorksheet(sheetId);
    },
  };
}
