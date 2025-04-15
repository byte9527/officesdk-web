import type { RemoteProxy } from '@officesdk/rpc';
import type {
  DocumentMethods,
  DocumentSelection,
  DocumentRange,
  DocumentRangeValue,
  RpcReturnProxy,
} from '../../shared';

export function createSelectionFacade(methods: RemoteProxy<DocumentMethods>): RpcReturnProxy<DocumentSelection> {
  let selectionCache: Promise<DocumentSelection> | null = null;

  const getSelection = async (): Promise<DocumentSelection> => {
    if (selectionCache) {
      return selectionCache;
    }

    selectionCache = methods.getSelection();
    return selectionCache;
  };

  return {
    getRange: async (): Promise<DocumentRange | null> => {
      const selection = await getSelection();
      return selection.getRange();
    },
    setRange: async (range: DocumentRangeValue | null): Promise<void> => {
      const selection = await getSelection();
      return selection.setRange(range);
    },
    addRangeListener: async (listener: (range: DocumentRangeValue) => void): Promise<void> => {
      const selection = await getSelection();
      return selection.addRangeListener(listener);
    },
  };
}
