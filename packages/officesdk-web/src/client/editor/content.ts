import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type { EditorContentMethods, EditorContent, EditorContentRecord } from '../../shared';

export function createContentFacade(methods: RPCReturnMethods<EditorContentMethods>): RPCReturnMapProxy<EditorContent> {
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

    addContentListener: async (listener: (record: EditorContentRecord) => void) => {
      const content = await getContent();
      const value = await content.addContentListener(listener);
      return value
    },
  };
}
