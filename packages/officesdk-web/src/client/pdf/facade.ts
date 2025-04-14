import type { Client } from '@officesdk/rpc';
import type { PdfMethods } from '../../shared';

export interface PdfFacade {
  // TODO: Implement based on PdfMethods
}

export function createPdfFacade(client: Client<PdfMethods>): PdfFacade {
  return {
    // TODO: Implement based on PdfMethods
  };
}
