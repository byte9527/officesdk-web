import type { DocumentOutline } from '../../shared';

export function createDocumentOutlineProxy(outline: DocumentOutline): DocumentOutline {
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
