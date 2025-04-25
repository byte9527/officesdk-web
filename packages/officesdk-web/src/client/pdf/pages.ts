import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';

import type { PdfMethods, PdfPages, PdfPage } from '../../shared';

export function createPagesFacade(methods: RPCReturnMethods<PdfMethods>): RPCReturnMapProxy<PdfPages> {
  let pagesCache: Promise<RPCReturnMapProxy<PdfPages>> | null = null;

  const getPages = async (): Promise<RPCReturnMapProxy<PdfPages>> => {
    if (pagesCache) {
      return pagesCache;
    }

    pagesCache = methods.getPages();
    return pagesCache;
  };

  return {
    getCurrentPageNumber: async (): Promise<number> => {
      const pages = await getPages();
      return pages.getCurrentPageNumber();
    },
    setCurrentPage: async (page: number): Promise<void> => {
      const pages = await getPages();
      return pages.setCurrentPage(page);
    },
    getPagesCount: async (): Promise<number> => {
      const pages = await getPages();
      return pages.getPagesCount();
    },
    getPage: async (page: number): Promise<RPCReturnMapProxy<PdfPage> | null> => {
      const pages = await getPages();

      return pages.getPage(page);
    },
  };
}
