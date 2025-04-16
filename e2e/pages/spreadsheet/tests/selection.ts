import { mockSpreadsheetEditor } from '../mocks/editor';

export function testSelection(container: HTMLElement): void {
  const output = (message: string) => {
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
  };

  const editor = mockSpreadsheetEditor(output);

  // Test selection operations
  const selections = editor.selections;
  if (selections && selections.length > 0) {
    const selection = selections[0];
    const range = selection.getRange();
    if (range) {
      range.getText();
      range.setText('new text');
      range.getHtml();
      range.setHtml('<td>new html</td>');
    }
  }

  // Test range listener
  editor.activeSheet.addRangeListener((range) => {
    output(`Range changed: ${JSON.stringify(range)}`);
  });
}
