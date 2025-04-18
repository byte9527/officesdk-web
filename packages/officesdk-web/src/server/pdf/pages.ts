import type { PdfPages } from '../../shared';
import { createPdfPageProxy } from './page';

export function createPdfPagesProxy(pages: PdfPages): PdfPages {
  return {
    getCurrentPageNumber: () => {
      return pages.getCurrentPageNumber();
    },
    setCurrentPage: (page) => {
      return pages.setCurrentPage(page);
    },
    getPagesCount: () => {
      return pages.getPagesCount();
    },
    getPage: async (page) => {
      const pdfPage = await pages.getPage(page);
      return createPdfPageProxy(pdfPage);
    },
  };
}
