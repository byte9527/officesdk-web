import type { RPCReturnMapProxy, RPCReturnMethods } from '@officesdk/rpc';
import type {
  DatabaseTableMethods,
  DatabaseTableSelection,
  DatabaseTableSelectionType,
  DatabaseTableSelectionValue,
} from '../../shared';

export function createDBTableSelectionFacade(methods: RPCReturnMethods<DatabaseTableMethods>) {
  let selectionCache: RPCReturnMapProxy<DatabaseTableSelection> | null = null;

  const getDBTableSelection = async (): Promise<RPCReturnMapProxy<DatabaseTableSelection>> => {
    if (selectionCache) {
      return selectionCache;
    }

    const selection = await methods.getDBTableSelection();
    selectionCache = selection;
    return selectionCache;
  };

  return {
    getSelection: async (): Promise<DatabaseTableSelectionValue | null> => {
      const selection = await getDBTableSelection();
      return selection.getSelection();
    },
    getSelectionType: async (): Promise<DatabaseTableSelectionType | null> => {
      const selection = await getDBTableSelection();
      return selection.getSelectionType();
    },
    selectRange: async (
      range: {
        row: number;
        column: number;
        rowCount: number;
        columnCount: number;
      } | null,
    ): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectRange(range);
    },
    selectRow: async (row: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectRow(row);
    },
    selectColumn: async (column: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectColumn(column);
    },
    selectCell: async (row: number, column: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectCell(row, column);
    },
    selectMultipleRows: async (rows: number[]): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectMultipleRows(rows);
    },
    selectMultipleColumns: async (column: number, columnCount: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectMultipleColumns(column, columnCount);
    },
  };
}
