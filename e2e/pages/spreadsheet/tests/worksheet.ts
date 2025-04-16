import { mockSpreadsheetEditor } from '../mocks/editor';

export function testWorksheet(container: HTMLElement): void {
  const output = (message: string) => {
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
  };

  const editor = mockSpreadsheetEditor(output);
  const sheet = editor.activeSheet;

  // Test basic worksheet properties
  output(`Worksheet ID: ${sheet.id}`);
  output(`Worksheet Name: ${sheet.name}`);
  output(`Is Active: ${sheet.isActive}`);

  // Test cell operations
  const cell = sheet.getCell(0, 0);
  if (cell) {
    output(`Cell at (0,0) - Text: ${cell.getCellText()}`);
    output(`Cell at (0,0) - Value: ${cell.getCellValue()}`);
  }

  // Test active cell operations
  const activeCell = sheet.getActiveCell();
  if (activeCell) {
    output(`Active cell position: (${activeCell.row}, ${activeCell.column})`);
  }

  // Test cell navigation
  sheet.setActiveCell({ row: 2, column: 3 });
  sheet.locateCell(2, 3);

  // Test selections
  const selections = sheet.getSelections();
  if (selections) {
    output(`Number of selections: ${selections.length}`);
    selections.forEach((selection, index) => {
      const range = selection.getRange();
      if (range) {
        output(`Selection ${index + 1} - Type: ${range.type}, Position: (${range.row}, ${range.column})`);
      }
    });
  }

  // Test physical position
  const mockRange = editor.selections?.[0]?.getRange();
  if (mockRange) {
    const physicalPos = sheet.getPhysicalPosition(mockRange);
    if (physicalPos) {
      output(`Physical position: ${JSON.stringify(physicalPos)}`);
    }
  }

  // Test range listener
  sheet.addRangeListener((range) => {
    output(`Range changed: ${JSON.stringify(range)}`);
  });
}
