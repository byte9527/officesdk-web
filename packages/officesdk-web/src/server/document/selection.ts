import { Token } from '@officesdk/rpc';

import type { DocumentSelection, DocumentRangeValue, DocumentRange } from '../../shared';

export function proxyRange(range: DocumentRange): Token {
  return new Token(range, {
    callbacks: ['&getText', '&setText', '&getHtml', '&setHtml'],
  });
}

export function proxySelection(selection: DocumentSelection) {
  return new Token(
    {
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
    },
    {
      callbacks: ['&addRangeListener', '&getRange', '&setRange'],
    },
  );
}
