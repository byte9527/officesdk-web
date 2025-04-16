import type {
  EditorContent,
  EditorContentRecord,
  SpreadsheetEditor,
  SpreadsheetWorkbook,
  SpreadsheetWorksheet,
  SpreadsheetCell,
  SpreadsheetSelection,
  SpreadsheetRange,
  SpreadsheetRangeValue,
} from '@officesdk/web';

export function mockSpreadsheetEditor(output: (message: string) => void): SpreadsheetEditor {
  const mockCell: SpreadsheetCell = {
    row: 0,
    column: 0,
    sheetId: 'mock-sheet-1',
    getCellText: () => {
      output('spreadsheet.cell.getCellText has been called');
      return 'mock cell text';
    },
    getCellValue: () => {
      output('spreadsheet.cell.getCellValue has been called');
      return 'mock cell value';
    },
  };

  const mockRange: SpreadsheetRange = {
    type: 'cells' as const,
    row: 0,
    column: 0,
    rowCount: 1,
    columnCount: 1,
    getText: () => {
      output('spreadsheet.range.getText has been called');
      return 'mock range text';
    },
    setText: (text: string) => {
      output(`spreadsheet.range.setText has been called with text: ${text}`);
    },
    getHtml: () => {
      output('spreadsheet.range.getHtml has been called');
      return '<td>mock range html</td>';
    },
    setHtml: (html: string) => {
      output(`spreadsheet.range.setHtml has been called with html: ${html}`);
    },
  };

  const mockSelection: SpreadsheetSelection = {
    getRange: (value?: SpreadsheetRangeValue) => {
      output('spreadsheet.selection.getRange has been called');
      return mockRange;
    },
    setRange: (value: SpreadsheetRangeValue | null) => {
      output('spreadsheet.selection.setRange has been called');
    },
  };

  const mockWorksheet: SpreadsheetWorksheet = {
    id: 'mock-sheet-1',
    name: 'Sheet1',
    isActive: true,
    getSelections: () => {
      output('spreadsheet.worksheet.getSelections has been called');
      return [mockSelection];
    },
    getPhysicalPosition: (range: SpreadsheetRange) => {
      output('spreadsheet.worksheet.getPhysicalPosition has been called');
      return { left: 0, top: 0, width: 100, height: 30 };
    },
    addRangeListener: (listener: (range: { sheet: string; ranges: SpreadsheetRangeValue[] }) => void) => {
      output('spreadsheet.worksheet.addRangeListener has been called');
      setTimeout(() => {
        listener({
          sheet: 'mock-sheet-1',
          ranges: [
            {
              type: 'cells' as const,
              row: 0,
              column: 0,
              rowCount: 1,
              columnCount: 1,
            },
          ],
        });
      });
      return () => {};
    },
    getCell: (row: number, column: number) => {
      output(`spreadsheet.worksheet.getCell has been called with row: ${row}, column: ${column}`);
      return mockCell;
    },
    getActiveCell: () => {
      output('spreadsheet.worksheet.getActiveCell has been called');
      return mockCell;
    },
    setActiveCell: (options: { row: number; column: number }) => {
      output(`spreadsheet.worksheet.setActiveCell has been called with row: ${options.row}, column: ${options.column}`);
    },
    locateCell: (row: number, column: number) => {
      output(`spreadsheet.worksheet.locateCell has been called with row: ${row}, column: ${column}`);
    },
  };

  const mockWorkbook: SpreadsheetWorkbook = {
    getWorksheets: () => {
      output('spreadsheet.workbook.getWorksheets has been called');
      return [mockWorksheet];
    },
    getWorksheetById: (sheetId: string) => {
      output(`spreadsheet.workbook.getWorksheetById has been called with sheetId: ${sheetId}`);
      return mockWorksheet;
    },
    getActiveWorksheet: () => {
      output('spreadsheet.workbook.getActiveWorksheet has been called');
      return mockWorksheet;
    },
    setActiveWorksheet: (sheetId: string) => {
      output(`spreadsheet.workbook.setActiveWorksheet has been called with sheetId: ${sheetId}`);
    },
  };

  const mockContent: EditorContent = {
    save: () => {
      output('spreadsheet.content.save has been called');
      return Promise.resolve();
    },
    addContentListener: (listener: (record: EditorContentRecord) => void) => {
      output('spreadsheet.content.addContentListener has been called');
      return Promise.resolve();
    },
  };

  return {
    workbook: mockWorkbook,
    activeSheet: mockWorksheet,
    activeCell: mockCell,
    selections: [mockSelection],
    content: mockContent,
  };
}
