import type { SpreadsheetWorkbook } from '../../shared';
import { createSpreadsheetWorksheetProxy } from './worksheet';

export function createSpreadsheetWorkbookProxy(workbook: SpreadsheetWorkbook): SpreadsheetWorkbook {
  return {
    getWorksheets: () => {
      return workbook.getWorksheets().map((worksheet) => createSpreadsheetWorksheetProxy(worksheet));
    },
    getWorksheetById: (sheetId) => {
      const worksheet = workbook.getWorksheetById(sheetId);
      if (!worksheet) {
        return null;
      }
      return createSpreadsheetWorksheetProxy(worksheet);
    },
    getActiveWorksheet: () => {
      return createSpreadsheetWorksheetProxy(workbook.getActiveWorksheet());
    },
    setActiveWorksheet: (sheetId) => {
      return workbook.setActiveWorksheet(sheetId);
    },
  };
}
