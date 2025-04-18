import type { PresentationSelection } from '../../shared';
import { createPresentationTextRangeProxy } from './range';

export function createPresentationSelectionProxy(selection: PresentationSelection): PresentationSelection {
  return {
    getTextRange: () => {
      const range = selection.getTextRange();

      if (!range) {
        return null;
      }

      return createPresentationTextRangeProxy(range);
    },
    setTextRange: (range) => {
      return selection.setTextRange(range);
    },
    getSelectedShapes: () => {
      return selection.getSelectedShapes();
    },
    setSelectedShapes: (ids) => {
      return selection.setSelectedShapes(ids);
    },
    addRangeListener: (listener) => {
      return selection.addRangeListener(listener);
    },
  };
}
