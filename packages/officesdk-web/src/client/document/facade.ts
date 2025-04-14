import type { Client, RemoteProxy } from '@officesdk/rpc';
import type {
  DocumentMethods,
  DocumentSelection,
  DocumentContent,
  DocumentRange,
  DocumentRangeValue,
  DocumentContentRecord,
  RpcReturnProxy,
} from '../../shared';

export interface DocumentFacade {
  /**
   * 选区实例
   */
  readonly selection: RpcReturnProxy<DocumentSelection>;

  /**
   * 主动保存内容
   */
  readonly content: RpcReturnProxy<DocumentContent>;

  // TODO: 初始化流程控制，初始化各类异常
}

export function createDocumentFacade(client: Client<DocumentMethods>): DocumentFacade {
  const { methods } = client;
  const selection = createSelectionFacade(methods);
  const content = createContentFacade(methods);

  return {
    get selection() {
      return selection;
    },
    get content() {
      return content;
    },
  };
}

function createSelectionFacade(methods: RemoteProxy<DocumentMethods>): RpcReturnProxy<DocumentSelection> {
  let selectionCache: Promise<DocumentSelection> | null = null;

  const getSelection = async (): Promise<DocumentSelection> => {
    if (selectionCache) {
      return selectionCache;
    }

    selectionCache = methods.getSelection();
    return selectionCache;
  };

  return {
    getRange: async (): Promise<DocumentRange | null> => {
      const selection = await getSelection();
      return selection.getRange();
    },
    setRange: async (range: DocumentRangeValue | null): Promise<void> => {
      const selection = await getSelection();
      await selection.setRange(range);
    },
    addRangeListener: async (listener: (range: DocumentRange) => void): Promise<void> => {
      const selection = await getSelection();
      await selection.addRangeListener(listener);
    },
  };
}

function createContentFacade(methods: RemoteProxy<DocumentMethods>): RpcReturnProxy<DocumentContent> {
  let contentCache: Promise<DocumentContent> | null = null;

  const getContent = async (): Promise<DocumentContent> => {
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

    addContentListener: async (listener: (record: DocumentContentRecord) => void): Promise<void> => {
      const content = await getContent();
      await content.addContentListener(listener);
    },
  };
}
