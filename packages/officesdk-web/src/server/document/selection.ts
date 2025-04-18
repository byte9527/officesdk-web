import type { DocumentSelection } from '../../shared';
import { createDocumentRangeProxy } from './range';

export function createDocumentSelectionProxy(selection: DocumentSelection): DocumentSelection {
  return {
    getRange: () => {
      const range = selection.getRange();

      if (!range) {
        return null;
      }

      return createDocumentRangeProxy(range);
    },
    setRange: (range) => {
      return selection.setRange(range);
    },
    addRangeListener: (listener) => {
      return selection.addRangeListener(listener);
    },
  };
}
