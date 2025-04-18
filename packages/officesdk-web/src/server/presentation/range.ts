import type { PresentationTextRange } from '../../shared';

export function createPresentationTextRangeProxy(range: PresentationTextRange): PresentationTextRange {
  return {
    start: range.start,
    end: range.end,
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
