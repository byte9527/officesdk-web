import type { RPCReturnMethods, RPCReturnMapProxy } from '@shimo/officesdk-rpc';

import type { PdfMethods, PdfSelection, PdfRange, PdfRangeValue } from '../../shared';

export function createSelectionFacade(methods: RPCReturnMethods<PdfMethods>): RPCReturnMapProxy<PdfSelection> {
  let selectionCache: Promise<RPCReturnMapProxy<PdfSelection>> | null = null;

  const getSelection = async (): Promise<RPCReturnMapProxy<PdfSelection>> => {
    if (selectionCache) {
      return selectionCache;
    }

    selectionCache = methods.getSelection();
    return selectionCache;
  };

  return {
    getRange: async (value?: PdfRangeValue): Promise<RPCReturnMapProxy<PdfRange> | null> => {
      const selection = await getSelection();
      return selection.getRange(value);
    },
    setRange: async (range: PdfRangeValue | null): Promise<void> => {
      const selection = await getSelection();
      return selection.setRange(range);
    },
    addRangeListener: async (listener: (range: PdfRangeValue) => void): Promise<void> => {
      const selection = await getSelection();
      return selection.addRangeListener(listener);
    },
  };
}
