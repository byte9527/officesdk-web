import type { DocumentTOCs, DocumentTocItem, DocumentTocContentItem } from '../../shared';

export function createDocumentTOCsProxy(TOCs: DocumentTOCs): DocumentTOCs {
  return {
    getAll: async () => {
      const items = await TOCs.getAll();
      return items.map((item) => createDocumentTocItemProxy(item));
    },
    getOne: async (index: number) => {
      const item = await TOCs.getOne(index);
      return item ? createDocumentTocItemProxy(item) : null;
    },
    deleteAll: () => TOCs.deleteAll(),
    deleteOne: (index: number) => TOCs.deleteOne(index),
    add: (options: { range?: string }) => TOCs.add(options),
  };
}

function createDocumentTocItemProxy(tocItem: DocumentTocItem): DocumentTocItem {
  return {
    getContent: () => tocItem.getContent(),
    addContentChangedListener: (listener: (content: DocumentTocContentItem[]) => void) => {
      return tocItem.addContentChangedListener(listener);
    },
    goto: (id: string) => tocItem.goto(id),
    update: () => tocItem.update(),
    updatePageNumbers: () => tocItem.updatePageNumbers(),
    setLevel: (level: number) => tocItem.setLevel(level),
  };
}
