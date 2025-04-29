import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type {
  PresentationMethods,
  PresentationSelection,
  PresentationTextRange,
  PresentationTextRangeValue,
  PresentationShape,
} from '../../shared';

export function createSelectionFacade(
  methods: RPCReturnMethods<PresentationMethods>,
): RPCReturnMapProxy<PresentationSelection> {
  let selectionCache: Promise<RPCReturnMapProxy<PresentationSelection>> | null = null;

  const getSelection = async (): Promise<RPCReturnMapProxy<PresentationSelection>> => {
    if (selectionCache) {
      return selectionCache;
    }

    selectionCache = methods.getSelection();
    return selectionCache;
  };

  return {
    getTextRange: async (): Promise<RPCReturnMapProxy<PresentationTextRange> | null> => {
      const selection = await getSelection();
      return selection.getTextRange();
    },
    setTextRange: async (range: PresentationTextRangeValue | null): Promise<void> => {
      const selection = await getSelection();
      return selection.setTextRange(range);
    },
    getSelectedShapes: async (): Promise<RPCReturnMapProxy<PresentationShape>[] | null> => {
      const selection = await getSelection();
      return selection.getSelectedShapes();
    },
    setSelectedShapes: async (ids: string[] | null): Promise<void> => {
      const selection = await getSelection();
      return selection.setSelectedShapes(ids);
    },
    addRangeListener: async (listener: (range: PresentationTextRangeValue | null) => void): Promise<void> => {
      const selection = await getSelection();
      return selection.addRangeListener(listener);
    },
  };
}
