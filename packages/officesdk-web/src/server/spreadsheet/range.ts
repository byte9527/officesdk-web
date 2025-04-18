import type { SpreadsheetRange } from '../../shared';

export function createSpreadsheetRangeProxy(range: SpreadsheetRange): SpreadsheetRange {
  return {
    get type() {
      return range.type;
    },
    get row() {
      return range.row;
    },
    get column() {
      return range.column;
    },
    get rowCount() {
      return range.rowCount;
    },
    get columnCount() {
      return range.columnCount;
    },
    getText: () => {
      return range.getText();
    },
    setText: (text) => {
      return range.setText(text);
    },
    getHtml: () => {
      return range.getHtml();
    },
    setHtml: (html) => {
      return range.setHtml(html);
    },
  };
}
