import type { SpreadsheetSelection } from '../../shared';
import { createSpreadsheetRangeProxy } from './range';

export function createSpreadsheetSelectionProxy(selection: SpreadsheetSelection): SpreadsheetSelection {
  return {
    getRange: (value) => {
      const range = selection.getRange(value);

      if (!range) {
        return null;
      }

      return createSpreadsheetRangeProxy(range);
    },
    setRange: (value) => {
      return selection.setRange(value);
    },
  };
}
