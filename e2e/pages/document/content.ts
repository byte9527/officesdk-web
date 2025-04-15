import type { EditorContent } from '@officesdk/web/server';

export function mockEditorContent(output: (message: string) => void): EditorContent {
  return {
    save: () => {
      output('document.content.save has been called');
      return Promise.resolve();
    },
    addContentListener: () => {
      output('document.content.addContentListener has been called');
      return Promise.resolve();
    },
  };
}
