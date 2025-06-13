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
  MultipleRows = 'MultipleRows',
  /**
   * Rectangular range selection (multiple cells)
   */
  Range = 'Range',
  /**
   * Multiple contiguous columns selection
   */
  MultipleColumns = 'MultipleColumns',
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
      row: number;
      /**
       * Zero-based column index in the current view
       */
      column: number;
    }
  | {
      /**
       * Single row selection
       */
      type: DatabaseTableSelectionType.Row;
      /**
       * Zero-based row index in the current view
       */
      row: number;
    }
  | {
      /**
       * Single column selection
       */
      type: DatabaseTableSelectionType.Column;
      /**
       * Zero-based column index in the current view
       */
      column: number;
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
      type: DatabaseTableSelectionType.MultipleRows;
      /**
       * Array of zero-based row indices in the current view
       */
      rows: number[];
    }
  | {
      /**
       * Multiple contiguous columns selection
       */
      type: DatabaseTableSelectionType.MultipleColumns;
      /**
       * Starting zero-based column index in the current view
       */
      column: number;
      /**
       * Number of columns selected
       */
      columnCount: number;
    }
  | {
      /**
       * Rectangular range selection
       */
      type: DatabaseTableSelectionType.Range;
      /**
       * Starting zero-based row index in the current view
       */
      row: number;
      /**
       * Starting zero-based column index in the current view
       */
      column: number;
      /**
       * Number of rows in the selection
       */
      rowCount: number;
      /**
       * Number of columns in the selection
       */
      columnCount: number;
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
      row: number;
      /**
       * Starting zero-based column index in the current view
       */
      column: number;
      /**
       * Number of rows in the selection
       */
      rowCount: number;
      /**
       * Number of columns in the selection
       */
      columnCount: number;
    } | null,
  ) => void;

  /**
   * Selects a single row
   * @param row - Zero-based row index in the current view
   */
  selectRow: (row: number) => void;

  /**
   * Selects a single column
   * @param column - Zero-based column index in the current view
   */
  selectColumn: (column: number) => void;

  /**
   * Selects a single cell
   * @param row - Zero-based row index in the current view
   * @param column - Zero-based column index in the current view
   */
  selectCell: (row: number, column: number) => void;

  /**
   * Selects multiple non-contiguous rows
   * @param rows - Array of zero-based row indices in the current view
   */
  selectMultipleRows: (rows: number[]) => void;

  /**
   * Selects multiple contiguous columns
   * @param column - Starting zero-based column index in the current view
   * @param columnCount - Number of columns to select
   */
  selectMultipleColumns: (column: number, columnCount: number) => void;
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
