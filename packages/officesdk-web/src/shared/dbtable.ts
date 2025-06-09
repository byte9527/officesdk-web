import type { EditorContent } from './editor';

export type DatabaseTableMethods = {
  /**
   * Returns the active database table sheet
   */
  getActiveDBSheet: () => DatabaseTableSheet;

  /**
   * Returns the current database table selection
   */
  getDBTableSelection: () => DatabaseTableSelection;

  /**
   * Returns the editor content
   */
  getContent: () => EditorContent;
};

/**
 * Defines the types of selections that can be made in a database table
 */
export enum DatabaseTableSelectionType {
  /**
   * Single cell selection
   */
  Cell = 'Cell',
  /**
   * Row selection
   */
  Row = 'Row',
  /**
   * Column selection
   */
  Column = 'Column',
  /**
   * Entire table selection
   */
  All = 'All',
  /**
   * Multiple non-contiguous rows selection
   */
  MultipleRow = 'MultipleRow',
  /**
   * Rectangular range selection (multiple cells)
   */
  Range = 'Range',
  /**
   * Multiple contiguous columns selection
   */
  MultipleColumn = 'MultipleColumn',
}

/**
 * Represents the value of a database table selection based on its type
 */
export type DatabaseTableSelectionValue =
  | {
      /**
       * Single cell selection
       */
      type: DatabaseTableSelectionType.Cell;
      /**
       * Zero-based row index in the current view
       */
      viewRow: number;
      /**
       * Zero-based column index in the current view
       */
      viewCol: number;
    }
  | {
      /**
       * Single row selection
       */
      type: DatabaseTableSelectionType.Row;
      /**
       * Zero-based row index in the current view
       */
      viewRow: number;
    }
  | {
      /**
       * Single column selection
       */
      type: DatabaseTableSelectionType.Column;
      /**
       * Zero-based column index in the current view
       */
      viewCol: number;
    }
  | {
      /**
       * Entire database table selection
       */
      type: DatabaseTableSelectionType.All;
    }
  | {
      /**
       * Multiple non-contiguous rows selection
       */
      type: DatabaseTableSelectionType.MultipleRow;
      /**
       * Array of zero-based row indices in the current view
       */
      viewRows: number[];
    }
  | {
      /**
       * Multiple contiguous columns selection
       */
      type: DatabaseTableSelectionType.MultipleColumn;
      /**
       * Starting zero-based column index in the current view
       */
      viewCol: number;
      /**
       * Number of columns selected
       */
      colCount: number;
    }
  | {
      /**
       * Rectangular range selection
       */
      type: DatabaseTableSelectionType.Range;
      /**
       * Starting zero-based row index in the current view
       */
      viewRow: number;
      /**
       * Starting zero-based column index in the current view
       */
      viewCol: number;
      /**
       * Number of rows in the selection
       */
      rowCount: number;
      /**
       * Number of columns in the selection
       */
      colCount: number;
    };

/**
 * Provides methods to get and manipulate the current selection in a database table
 */
export type DatabaseTableSelection = {
  /**
   * Returns the type of the current selection
   */
  getSelectionType: () => DatabaseTableSelectionType | null;

  /**
   * Returns the current selection value or null if nothing is selected
   */
  getSelection: () => DatabaseTableSelectionValue | null;

  /**
   * Selects a rectangular range of cells
   * @param range - The range to select, or null to clear selection
   */
  selectRange: (
    range: {
      /**
       * Starting zero-based row index in the current view
       */
      viewRow: number;
      /**
       * Starting zero-based column index in the current view
       */
      viewCol: number;
      /**
       * Number of rows in the selection
       */
      rowCount: number;
      /**
       * Number of columns in the selection
       */
      colCount: number;
    } | null,
  ) => void;

  /**
   * Selects a single row
   * @param viewRow - Zero-based row index in the current view
   */
  selectRow: (viewRow: number) => void;

  /**
   * Selects a single column
   * @param viewCol - Zero-based column index in the current view
   */
  selectCol: (viewCol: number) => void;

  /**
   * Selects a single cell
   * @param viewRow - Zero-based row index in the current view
   * @param viewCol - Zero-based column index in the current view
   */
  selectCell: (viewRow: number, viewCol: number) => void;

  /**
   * Selects multiple non-contiguous rows
   * @param viewRows - Array of zero-based row indices in the current view
   */
  selectMultipleRow: (viewRows: number[]) => void;

  /**
   * Selects multiple contiguous columns
   * @param viewCol - Starting zero-based column index in the current view
   * @param colCount - Number of columns to select
   */
  selectMultipleCol: (viewCol: number, colCount: number) => void;
};

/**
 * Represents the editor interface for database tables
 */
export interface DatabaseTableEditor {
  /**
   * The currently active database table sheet
   */
  readonly activeDBTable: DatabaseTableSheet;

  /**
   * The current selection in the database table
   */
  readonly selection: DatabaseTableSelection;

  /**
   * Saves all pending changes to the database table
   */
  saveChanges: () => Promise<void>;
}

/**
 * Configuration options for the database table SDK
 */
export interface DatabaseTableSDKOptions {}

/**
 * Represents a sheet in a database table
 */
export interface DatabaseTableSheet {
  // /**
  //  * Unique identifier for the sheet
  //  */
  // readonly id: string;

  // /**
  //  * Display name of the sheet
  //  */
  // readonly name: string;

  /**
   * The current selection in this sheet
   */
  readonly selection: DatabaseTableSelection | null;
}
