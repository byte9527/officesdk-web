import type { RemoteProxy } from '@officesdk/rpc';
import type {
  SpreadsheetMethods,
  SpreadsheetWorksheet,
  SpreadsheetSelection,
  SpreadsheetRange,
  SpreadsheetRangeValue,
  SpreadsheetCell,
} from '../../shared';

// Create a type that matches RpcReturnProperties
export type WorksheetFacade = {
  getSelections: () => Promise<SpreadsheetSelection[] | null>;
  getPhysicalPosition: (range: SpreadsheetRange) => Promise<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>;
  addRangeListener: (
    listener: (range: { sheet: string; ranges: SpreadsheetRangeValue[] }) => void,
  ) => Promise<() => void>;
  getCell: (row: number, column: number) => Promise<SpreadsheetCell | null>;
  getActiveCell: () => Promise<SpreadsheetCell | null>;
  setActiveCell: (options: { row: number; column: number }) => Promise<void>;
  locateCell: (row: number, column: number) => Promise<void>;
  id: string;
  name: string;
  isActive: boolean;
};

export function createWorksheetFacade(methods: RemoteProxy<SpreadsheetMethods>): WorksheetFacade {
  let worksheetCache: Promise<SpreadsheetWorksheet> | null = null;

  const getWorksheet = async (): Promise<SpreadsheetWorksheet> => {
    if (worksheetCache) {
      return worksheetCache;
    }

    worksheetCache = methods.getActiveSheet();
    return worksheetCache;
  };

  return {
    id: getWorksheet().then((worksheet) => worksheet.id),
    name: getWorksheet().then((worksheet) => worksheet.name),
    isActive: getWorksheet().then((worksheet) => worksheet.isActive),

    getSelections: async (): Promise<SpreadsheetSelection[] | null> => {
      const worksheet = await getWorksheet();
      return worksheet.getSelections();
    },

    getPhysicalPosition: async (
      range: SpreadsheetRange,
    ): Promise<{
      left: number;
      top: number;
      width: number;
      height: number;
    } | null> => {
      const worksheet = await getWorksheet();
      return worksheet.getPhysicalPosition(range);
    },

    addRangeListener: async (
      listener: (range: { sheet: string; ranges: SpreadsheetRangeValue[] }) => void,
    ): Promise<() => void> => {
      const worksheet = await getWorksheet();
      return worksheet.addRangeListener(listener);
    },

    getCell: async (row: number, column: number): Promise<SpreadsheetCell | null> => {
      const worksheet = await getWorksheet();
      return worksheet.getCell(row, column);
    },

    getActiveCell: async (): Promise<SpreadsheetCell | null> => {
      const worksheet = await getWorksheet();
      return worksheet.getActiveCell();
    },

    setActiveCell: async (options: { row: number; column: number }): Promise<void> => {
      const worksheet = await getWorksheet();
      return worksheet.setActiveCell(options);
    },

    locateCell: async (row: number, column: number): Promise<void> => {
      const worksheet = await getWorksheet();
      return worksheet.locateCell(row, column);
    },
  };
}
