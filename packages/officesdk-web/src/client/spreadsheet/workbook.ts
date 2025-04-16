import type { RemoteProxy } from '@officesdk/rpc';
import type { SpreadsheetMethods, SpreadsheetWorkbook, SpreadsheetWorksheet } from '../../shared';

// Create a type that matches RpcReturnProperties
type WorkbookFacade = {
  getWorksheets: () => Promise<SpreadsheetWorksheet[]>;
  getWorksheetById: (sheetId: string) => Promise<SpreadsheetWorksheet | null>;
  getActiveWorksheet: () => Promise<SpreadsheetWorksheet>;
  setActiveWorksheet: (sheetId: string) => Promise<void>;
};

export function createWorkbookFacade(methods: RemoteProxy<SpreadsheetMethods>): WorkbookFacade {
  let workbookCache: Promise<SpreadsheetWorkbook> | null = null;

  const getWorkbook = async (): Promise<SpreadsheetWorkbook> => {
    if (workbookCache) {
      return workbookCache;
    }

    workbookCache = methods.getWorkbook();
    return workbookCache;
  };

  return {
    getWorksheets: async (): Promise<SpreadsheetWorksheet[]> => {
      const workbook = await getWorkbook();
      return workbook.getWorksheets();
    },

    getWorksheetById: async (sheetId: string): Promise<SpreadsheetWorksheet | null> => {
      const workbook = await getWorkbook();
      return workbook.getWorksheetById(sheetId);
    },

    getActiveWorksheet: async (): Promise<SpreadsheetWorksheet> => {
      const workbook = await getWorkbook();
      return workbook.getActiveWorksheet();
    },

    setActiveWorksheet: async (sheetId: string): Promise<void> => {
      const workbook = await getWorkbook();
      return workbook.setActiveWorksheet(sheetId);
    },
  };
}
