import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type { DocumentMethods, DocumentSelection, DocumentRange, DocumentRangeValue } from '../../shared';

export function createSelectionFacade(
  methods: RPCReturnMethods<DocumentMethods>,
): RPCReturnMapProxy<DocumentSelection> {
  let selectionCache: Promise<RPCReturnMapProxy<DocumentSelection>> | null = null;

  const getSelection = async (): Promise<RPCReturnMapProxy<DocumentSelection>> => {
    if (selectionCache) {
      return selectionCache;
    }

    selectionCache = methods.getSelection();
    return selectionCache;
  };

  return {
    getRange: async (): Promise<RPCReturnMapProxy<DocumentRange> | null> => {
      const selection = await getSelection();
      return selection.getRange();
    },
    setRange: async (range: DocumentRangeValue | null): Promise<void> => {
      const selection = await getSelection();
      return selection.setRange(range);
    },
    addRangeListener: async (listener: (range: DocumentRangeValue | null) => void): Promise<void> => {
      const selection = await getSelection();
      return selection.addRangeListener(listener);
    },
    getWholeRange: async (): Promise<RPCReturnMapProxy<DocumentRange>>=> {
      const selection = await getSelection();
      return selection.getWholeRange();
    }
  };
}
