import type { EditorContent } from '../../shared';

export function createEditorContentProxy(content: EditorContent): EditorContent {
  return {
    save: () => {
      return content.save();
    },
    addContentListener: (listener) => {
      return content.addContentListener(listener);
    },
  };
}
