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
        viewRow: number;
        viewCol: number;
        rowCount: number;
        colCount: number;
      } | null,
    ): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectRange(range);
    },
    selectRow: async (row: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectRow(row);
    },
    selectCol: async (col: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectCol(col);
    },
    selectCell: async (row: number, column: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectCell(row, column);
    },
    selectMultipleRow: async (rows: number[]): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectMultipleRow(rows);
    },
    selectMultipleCol: async (col: number, colCount: number): Promise<void> => {
      const selection = await getDBTableSelection();
      return selection.selectMultipleCol(col, colCount);
    },
  };
}
