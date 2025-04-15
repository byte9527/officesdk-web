import type { Client } from '@officesdk/rpc';
import type { DocumentMethods, DocumentSelection, EditorContent, RpcReturnProxy } from '../../shared';
import { createSelectionFacade } from './selection';
import { createContentFacade } from './content';

export interface DocumentFacade {
  /**
   * 选区实例
   */
  readonly selection: RpcReturnProxy<DocumentSelection>;

  /**
   * 主动保存内容
   */
  readonly content: RpcReturnProxy<EditorContent>;

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
