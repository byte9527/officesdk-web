import type { Client, RPCReturnMapProxy } from '@shimo/officesdk-rpc';
import type { PdfMethods, PdfPages, PdfSelection, PdfOutline } from '../../shared';
import { createSelectionFacade } from './selection';
import { createPagesFacade } from './pages';
import { createOutlineFacade } from '../editor/outline';

export interface PdfFacade {
  /**
   * 页面操作实例
   */
  readonly pages: RPCReturnMapProxy<PdfPages>;

  /**
   * 选区实例
   */
  readonly selection: RPCReturnMapProxy<PdfSelection>;

  /**
   * 目录实例
   */
  readonly outline: RPCReturnMapProxy<PdfOutline>;
}

export function createPdfFacade(client: Client<PdfMethods>): PdfFacade {
  const { methods } = client;
  const pages = createPagesFacade(methods);
  const selection = createSelectionFacade(methods);
  const outline = createOutlineFacade<{ text: string }>(methods);

  return {
    get pages() {
      return pages;
    },
    get selection() {
      return selection;
    },
    get outline() {
      return outline;
    },
  };
}
