import type { DocumentRange } from '../../shared';

export function createDocumentRangeProxy(range: DocumentRange): DocumentRange {
  return {
    start: range.start,
    end: range.end,
    isCaret: range.isCaret,
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
    getBounding: () => {
      return range.getBounding();
    },
  };
}
