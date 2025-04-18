import type { PdfSelection } from '../../shared';
import { createPdfRangeProxy } from './range';

export function createPdfSelectionProxy(selection: PdfSelection): PdfSelection {
  return {
    getRange: (value) => {
      const range = selection.getRange(value);

      if (!range) {
        return null;
      }

      return createPdfRangeProxy(range);
    },
    setRange: (value) => {
      return selection.setRange(value);
    },
    addRangeListener: (listener) => {
      return selection.addRangeListener(listener);
    },
  };
}
