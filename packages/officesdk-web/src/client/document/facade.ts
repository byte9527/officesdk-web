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
  // selection 对象可以复用
  const selectionPromise = methods.getSelection();

  return {
    getRange: async (): Promise<DocumentRange | null> => {
      const selection = await selectionPromise;
      return selection.getRange();
    },
    setRange: async (range: DocumentRangeValue | null): Promise<void> => {
      const selection = await selectionPromise;
      await selection.setRange(range);
    },
    addRangeListener: async (listener: (range: DocumentRange) => void): Promise<void> => {
      const selection = await selectionPromise;
      await selection.addRangeListener(listener);
    },
  };
}

function createContentFacade(methods: RemoteProxy<DocumentMethods>): RpcReturnProxy<DocumentContent> {
  const contentPromise = methods.getContent();

  return {
    save: async (): Promise<void> => {
      const content = await contentPromise;
      await content.save();
    },

    addContentListener: async (listener: (record: DocumentContentRecord) => void): Promise<void> => {
      const content = await contentPromise;
      await content.addContentListener(listener);
    },
  };
}
