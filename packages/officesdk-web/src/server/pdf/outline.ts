import type { PdfOutline } from '../../shared';

export function createPdfOutlineProxy(outline: PdfOutline): PdfOutline {
  return {
    getContent: async () => {
      return outline.getContent();
    },
    addChangedListener: (listener) => {
      return outline.addChangedListener(listener);
    },
    goto: async (id) => {
      return outline.goto(id);
    },
  };
}
