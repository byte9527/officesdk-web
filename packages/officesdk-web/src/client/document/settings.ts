import type { DocxMenuOptions } from '@officesdk/editor-sdk-core/docx';
import type { DocumentSDKOptions } from '../../shared';

export interface DocumentSettings {
  /**
   * menu settings
   */
  menu?: {
    custom?: DocxMenuOptions['custom'];
    features?: DocxMenuOptions['features'];
  };
  
}

export function createDocumentOptions(settings?: DocumentSettings): DocumentSDKOptions | null {
  return {
    menu: settings?.menu,
  };
}
