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
    selectRange: (selectionValue: { row: number; column: number; rowCount: number; columnCount: number } | null) => {
      return selection.selectRange(selectionValue);
    },
    selectRow: (row: number) => {
      return selection.selectRow(row);
    },
    selectColumn: (column: number) => {
      return selection.selectColumn(column);
    },
    selectCell: (row: number, column: number) => {
      return selection.selectCell(row, column);
    },
    selectMultipleRows: (rows: number[]) => {
      return selection.selectMultipleRows(rows);
    },
    selectMultipleColumns: (column: number, columnCount: number) => {
      return selection.selectMultipleColumns(column, columnCount);
    },
  };
}
