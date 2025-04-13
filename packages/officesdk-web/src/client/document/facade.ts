import type { Client } from '@officesdk/rpc';
import type { DocumentSDK, DocumentSelection, DocumentContent } from '../../shared';

export interface DocumentFacade {
  /**
   * 选区实例
   */
  readonly selection: DocumentSelection;

  /**
   * 主动保存内容
   */
  readonly content: DocumentContent;

  // TODO: 初始化流程控制，初始化各类异常
}

export function createDocumentFacade(client: Client<DocumentSDK>): DocumentFacade {
  return {
    // TODO:
  };
}
