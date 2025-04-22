import type { PdfRange } from '../../shared';

export function createPdfRangeProxy(range: PdfRange): PdfRange {
  return {
    start: range.start,
    end: range.end,
    getText: () => {
      return range.getText();
    },
    getHtml: () => {
      return range.getHtml();
    },
    getBounding: () => {
      return range.getBounding();
    },
  };
}
