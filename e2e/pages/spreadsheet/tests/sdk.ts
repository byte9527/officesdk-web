import { mockSpreadsheetEditor } from '../mocks/editor';

export function testSDK(container: HTMLElement): void {
  const output = (message: string) => {
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
  };

  const editor = mockSpreadsheetEditor(output);

  // Test workbook operations
  editor.workbook.getWorksheets();
  editor.workbook.getWorksheetById('mock-sheet-1');
  editor.workbook.getActiveWorksheet();
  editor.workbook.setActiveWorksheet('mock-sheet-2');

  // Test worksheet operations
  const sheet = editor.activeSheet;
  sheet.getSelections();
  sheet.getCell(0, 0);
  sheet.getActiveCell();
  sheet.setActiveCell({ row: 1, column: 1 });
  sheet.locateCell(2, 2);

  // Test cell operations
  const cell = editor.activeCell;
  if (cell) {
    cell.getCellText();
    cell.getCellValue();
  }
}
