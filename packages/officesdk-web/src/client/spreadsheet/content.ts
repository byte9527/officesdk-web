import type { RemoteProxy } from '@officesdk/rpc';
import type { SpreadsheetMethods, EditorContent, EditorContentRecord, RpcReturnProxy } from '../../shared';

export function createContentFacade(methods: RemoteProxy<SpreadsheetMethods>): RpcReturnProxy<EditorContent> {
  let contentCache: Promise<EditorContent> | null = null;

  const getContent = async (): Promise<EditorContent> => {
    if (contentCache) {
      return contentCache;
    }

    contentCache = methods.getContent();
    return contentCache;
  };

  return {
    save: async (): Promise<void> => {
      const content = await getContent();
      await content.save();
    },

    addContentListener: async (listener: (record: EditorContentRecord) => void): Promise<void> => {
      const content = await getContent();
      await content.addContentListener(listener);
    },
  };
}
