import type { DocumentEditor } from '@officesdk/web/server';

export function mockDocumentEditor(output: (message: string) => void): DocumentEditor {
  return {
    selection: {
      getRange: () => null,
      setRange: () => {
        output('document.selection.setRange has been called');
      },
      addRangeListener: () => {
        output('document.selection.addRangeListener has been called');
      },
    },
    content: {
      save: () => {
        output('document.content.save has been called');
        return Promise.resolve();
      },
      addContentListener: () => {
        output('document.content.addContentListener has been called');
        return Promise.resolve();
      },
    },
  };
}
