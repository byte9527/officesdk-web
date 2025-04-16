import { mockSpreadsheetEditor } from '../mocks/editor';

export function testWorkbook(container: HTMLElement): void {
  const output = (message: string) => {
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
  };

  const editor = mockSpreadsheetEditor(output);
  const workbook = editor.workbook;

  // Test getting all worksheets
  const sheets = workbook.getWorksheets();
  output(`Found ${sheets.length} worksheet(s)`);

  // Test getting worksheet by ID
  const sheet1 = workbook.getWorksheetById('mock-sheet-1');
  if (sheet1) {
    output(`Found worksheet: ${sheet1.name}`);
  }

  // Test getting non-existent worksheet
  const nonExistentSheet = workbook.getWorksheetById('non-existent-sheet');
  output(`Non-existent sheet lookup returned: ${nonExistentSheet === null ? 'null' : 'not null'}`);

  // Test active worksheet operations
  const activeSheet = workbook.getActiveWorksheet();
  output(`Active worksheet: ${activeSheet.name}`);

  // Test switching active worksheet
  workbook.setActiveWorksheet('mock-sheet-2');
  const newActiveSheet = workbook.getActiveWorksheet();
  output(`New active worksheet: ${newActiveSheet.name}`);
}
