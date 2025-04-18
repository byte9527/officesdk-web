import type { RPCReturnMethods, RPCReturnMapProxy } from '@shimo/officesdk-rpc';
import type { EditorMethods, EditorContent, EditorContentRecord } from '../../shared';

export function createContentFacade(methods: RPCReturnMethods<EditorMethods>): RPCReturnMapProxy<EditorContent> {
  let contentCache: Promise<RPCReturnMapProxy<EditorContent>> | null = null;

  const getContent = async (): Promise<RPCReturnMapProxy<EditorContent>> => {
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
