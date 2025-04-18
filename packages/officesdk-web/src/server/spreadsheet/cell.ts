import type { SpreadsheetCell } from '../../shared';

export function createSpreadsheetCellProxy(cell: SpreadsheetCell): SpreadsheetCell {
  return {
    get row() {
      return cell.row;
    },
    get column() {
      return cell.column;
    },
    get sheetId() {
      return cell.sheetId;
    },
    getCellText: () => {
      return cell.getCellText();
    },
    getCellValue: () => {
      return cell.getCellValue();
    },
  };
}
