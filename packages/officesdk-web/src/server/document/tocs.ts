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
    deleteAll: async () => {
      return TOCs.deleteAll();
    },
    deleteOne: async (index: number) => {
      return TOCs.deleteOne(index);
    },
    add: async (options: { range?: string }) => {
      return TOCs.add(options);
    },
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
