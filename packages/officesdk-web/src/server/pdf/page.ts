import type { PdfPage } from '../../shared';

export function createPdfPageProxy(page: PdfPage): PdfPage {
  return {
    pageNumber: page.pageNumber,
    getPageSize: () => {
      return page.getPageSize();
    },
  };
}
