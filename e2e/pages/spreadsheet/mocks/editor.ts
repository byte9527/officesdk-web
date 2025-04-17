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

function createCell(
  output: (message: string) => void,
  props: { row: number; column: number; sheetId: string },
): SpreadsheetCell {
  return {
    row: props.row,
    column: props.column,
    sheetId: props.sheetId,
    getCellText: () => {
      output('spreadsheet.cell.getCellText has been called');
      return 'mock cell text';
    },
    getCellValue: () => {
      output('spreadsheet.cell.getCellValue has been called');
      return 'mock cell value';
    },
  };
}

function createRange(output: (message: string) => void, props: SpreadsheetRangeValue): SpreadsheetRange {
  let text = 'mock range text';
  let html = '<div>mock range html</div>';
  return {
    column: 0,
    row: 0,
    rowCount: 0,
    columnCount: 0,
    ...props,
    getText: () => {
      output('spreadsheet.range.getText has been called');
      return text;
    },
    setText: (text: string) => {
      output(`spreadsheet.range.setText has been called with text: ${text}`);
      text = text;
    },
    getHtml: () => {
      output('spreadsheet.range.getHtml has been called');
      return html;
    },
    setHtml: (html: string) => {
      output(`spreadsheet.range.setHtml has been called with html: ${html}`);
      html = html;
    },
  };
}

function createSelection(output: (message: string) => void, props: { range: SpreadsheetRange }): SpreadsheetSelection {
  let range: SpreadsheetRange | null = props.range;

  return {
    getRange: (value?: SpreadsheetRangeValue) => {
      output('spreadsheet.selection.getRange has been called');
      if (value) {
        return createRange(output, value);
      }
      return range;
    },
    setRange: (value: SpreadsheetRangeValue | null) => {
      output('spreadsheet.selection.setRange has been called');
      range = value ? createRange(output, value) : null;
    },
  };
}

function createMockWorksheet(
  output: (message: string) => void,
  props: { id: string; name: string; isActive: boolean },
): SpreadsheetWorksheet {
  let mockedActiveCell = createCell(output, {
    row: 0,
    column: 0,
    sheetId: props.id,
  });

  const mockedRange = createRange(output, {
    type: 'cells',
    row: 0,
    column: 0,
    rowCount: 1,
    columnCount: 1,
  });

  const mockedSelection = createSelection(output, {
    range: mockedRange,
  });

  return {
    id: props.id,
    name: props.name,
    isActive: props.isActive,
    getSelections: () => {
      output('spreadsheet.worksheet.getSelections has been called');
      return [mockedSelection];
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
      return createCell(output, {
        row,
        column,
        sheetId: props.id,
      });
    },
    getActiveCell: () => {
      output('spreadsheet.worksheet.getActiveCell has been called');
      return mockedActiveCell;
    },
    setActiveCell: (options: { row: number; column: number }) => {
      mockedActiveCell = createCell(output, {
        row: options.row,
        column: options.column,
        sheetId: props.id,
      });
      output(`spreadsheet.worksheet.setActiveCell has been called with row: ${options.row}, column: ${options.column}`);
    },
    locateCell: (row: number, column: number) => {
      output(`spreadsheet.worksheet.locateCell has been called with row: ${row}, column: ${column}`);
    },
  };
}

export function mockSpreadsheetEditor(output: (message: string) => void): SpreadsheetEditor {
  const mockedCell1 = createCell(output, {
    row: 0,
    column: 0,
    sheetId: 'mock-sheet-1',
  });

  const mockedCell2 = createCell(output, {
    row: 1,
    column: 1,
    sheetId: 'mock-sheet-2',
  });

  const mockedRange = createRange(output, {
    type: 'cells',
    row: 0,
    column: 0,
    rowCount: 1,
    columnCount: 1,
  });

  const mockedSelection = createSelection(output, {
    range: mockedRange,
  });

  const mockWorksheet1 = createMockWorksheet(output, {
    id: mockedCell1.sheetId,
    name: 'Sheet1',
    isActive: true,
  });

  const mockWorksheet2 = createMockWorksheet(output, {
    id: mockedCell2.sheetId,
    name: 'Sheet2',
    isActive: false,
  });

  let activeWorksheet = mockWorksheet1;

  const mockWorkbook: SpreadsheetWorkbook = {
    getWorksheets: () => {
      output('spreadsheet.workbook.getWorksheets has been called');
      return [mockWorksheet1, mockWorksheet2];
    },
    getWorksheetById: (sheetId: string) => {
      output(`spreadsheet.workbook.getWorksheetById has been called with sheetId: ${sheetId}`);
      return sheetId === mockWorksheet1.id ? mockWorksheet1 : mockWorksheet2;
    },
    getActiveWorksheet: () => {
      output('spreadsheet.workbook.getActiveWorksheet has been called');
      return activeWorksheet;
    },
    setActiveWorksheet: (sheetId: string) => {
      output(`spreadsheet.workbook.setActiveWorksheet has been called with sheetId: ${sheetId}`);
      activeWorksheet = sheetId === mockWorksheet1.id ? mockWorksheet1 : mockWorksheet2;
    },
  };

  const mockContent: EditorContent = {
    save: () => {
      output('spreadsheet.content.save has been called');
    },
    addContentListener: (listener: (record: EditorContentRecord) => void) => {
      output('spreadsheet.content.addContentListener has been called');
      setTimeout(() => {
        listener({
          id: 'mock-content-1',
          timestamp: Date.now(),
        });
      });
    },
  };

  return {
    workbook: mockWorkbook,
    activeSheet: mockWorksheet1,
    activeCell: mockedCell1,
    selections: [mockedSelection],
    content: mockContent,
  };
}
