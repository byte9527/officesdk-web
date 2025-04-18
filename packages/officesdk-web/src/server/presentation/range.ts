import type { PresentationTextRange } from '../../shared';

export function createPresentationTextRangeProxy(range: PresentationTextRange): PresentationTextRange {
  return {
    get start() {
      return range.start;
    },
    get end() {
      return range.end;
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
