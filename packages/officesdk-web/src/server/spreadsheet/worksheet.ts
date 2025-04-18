import type { SpreadsheetWorksheet } from '../../shared';
import { createSpreadsheetSelectionProxy } from './selection';
import { createSpreadsheetCellProxy } from './cell';

export function createSpreadsheetWorksheetProxy(worksheet: SpreadsheetWorksheet): SpreadsheetWorksheet {
  return {
    id: worksheet.id,
    name: worksheet.name,
    isActive: worksheet.isActive,
    getSelections: () => {
      const selections = worksheet.getSelections();
      if (!selections) {
        return null;
      }
      return selections.map((selection) => createSpreadsheetSelectionProxy(selection));
    },
    getPhysicalPosition: (range) => {
      return worksheet.getPhysicalPosition(range);
    },
    addRangeListener: (listener) => {
      return worksheet.addRangeListener(listener);
    },
    getCell: (row, column) => {
      const cell = worksheet.getCell(row, column);
      if (!cell) {
        return null;
      }
      return createSpreadsheetCellProxy(cell);
    },
    getActiveCell: () => {
      const cell = worksheet.getActiveCell();
      if (!cell) {
        return null;
      }
      return createSpreadsheetCellProxy(cell);
    },
    setActiveCell: (cell) => {
      return worksheet.setActiveCell(cell);
    },
    locateCell: (row, column) => {
      return worksheet.locateCell(row, column);
    },
  };
}
