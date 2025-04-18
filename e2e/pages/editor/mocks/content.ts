import type { EditorContent } from '@shimo/officesdk-web/server';

export function mockEditorContent(output: (message: string) => void): EditorContent {
  return {
    save: () => {
      output('document.content.save has been called');
    },
    addContentListener: (listener) => {
      output('document.content.addContentListener has been called');

      setTimeout(() => {
        listener({
          id: 'mocked-id',
          timestamp: Date.now(),
        });
      });
    },
  };
}
