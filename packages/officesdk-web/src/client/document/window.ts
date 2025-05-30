import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type { DocumentWindow, DocumentWindowScrollParams, DocumentMethods, DocumentRangeValue } from '../../shared';

export function createWindowFacade(methods: RPCReturnMethods<DocumentMethods>): RPCReturnMapProxy<DocumentWindow> {
  let windowCache: Promise<RPCReturnMapProxy<DocumentWindow>> | null = null;

  const getWindow = async (): Promise<RPCReturnMapProxy<DocumentWindow>> => {
    if (windowCache) {
      return windowCache;
    }

    windowCache = methods.getWindow();
    return windowCache;
  };

  return {
    getScrollPosition: async (): Promise<{ x: number; y: number }> => {
      const docxWindow = await getWindow();
      return docxWindow.getScrollPosition();
    },
    scrollTo: async (options: DocumentWindowScrollParams): Promise<void> => {
      const docxWindow = await getWindow();
      return docxWindow.scrollTo(options);
    },
    scrollToPage: async (page: number): Promise<void> => {
      const docxWindow = await getWindow();
      return docxWindow.scrollToPage(page);
    },
    scrollIntoView: async (range: DocumentRangeValue): Promise<void> => {
      const docxWindow = await getWindow();
      return docxWindow.scrollIntoView(range);
    },
    addScrollListener: async (listener: (offset: { x: number; y: number }) => void) => {
      const docxWindow = await getWindow();
      return docxWindow.addScrollListener(listener)
    },
  };
}
