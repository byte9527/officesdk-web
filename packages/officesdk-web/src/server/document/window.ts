import type { DocumentRangeValue, DocumentWindow, DocumentWindowScrollParams } from '../../shared';


export function createDocumentWindowProxy(documentWindow: DocumentWindow): DocumentWindow {
  return {
    getScrollPosition: () => {
      return documentWindow.getScrollPosition();
    },
    scrollTo: (params: DocumentWindowScrollParams) => {
      return documentWindow.scrollTo(params)
    },
    scrollToPage: (page: number) => {
      return documentWindow.scrollToPage(page)
    },
    scrollIntoView: (range: DocumentRangeValue) => {
      return documentWindow.scrollIntoView(range)
    },
    addScrollListener: (listener: (offset: { x: number; y: number }) => void) => {
      return documentWindow.addScrollListener(listener)
    }
  };
}
