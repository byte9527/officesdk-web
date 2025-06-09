import type { DatabaseTableSelection } from '../../shared';

/**
 * Create a proxy for database table selection
 *
 * @param selection - The selection object to proxy
 * @returns A DatabaseTableSelection proxy object
 */
export function createDatabaseTableSelectionProxy(selection: DatabaseTableSelection): DatabaseTableSelection {
  return {
    getSelection: () => {
      const selectionValue = selection.getSelection();

      if (!selectionValue) {
        return null;
      }

      return selectionValue;
    },
    getSelectionType: () => {
      return selection.getSelectionType();
    },
    selectRange: (selectionValue: { viewRow: number; viewCol: number; rowCount: number; colCount: number } | null) => {
      return selection.selectRange(selectionValue);
    },
    selectRow: (row: number) => {
      return selection.selectRow(row);
    },
    selectCol: (col: number) => {
      return selection.selectCol(col);
    },
    selectCell: (row: number, col: number) => {
      return selection.selectCell(row, col);
    },
    selectMultipleRow: (rows: number[]) => {
      return selection.selectMultipleRow(rows);
    },
    selectMultipleCol: (col: number, colCount: number) => {
      return selection.selectMultipleCol(col, colCount);
    },
  };
}
