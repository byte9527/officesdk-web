import { Token } from '@officesdk/rpc';

import type { DocumentSelection, DocumentRangeValue, DocumentRange } from '../../shared';

export function proxyRange(range: DocumentRange): Token {
  return new Token(range, {
    rules: [
      {
        type: 'callback',
        path: '&getText',
      },
      {
        type: 'callback',
        path: '&setText',
      },
      {
        type: 'callback',
        path: '&getHtml',
      },
      {
        type: 'callback',
        path: '&setHtml',
      },
    ],
  });
}

export function proxySelection(selection: DocumentSelection) {
  return {
    getRange() {
      const range = selection.getRange();

      if (!range) {
        return range;
      }

      return proxyRange(range);
    },
    setRange(range: DocumentRangeValue | null): void {
      selection.setRange(range);
    },
    addRangeListener(listener: (range: DocumentRangeValue) => void): void {
      selection.addRangeListener(listener);
    },
  };
}
