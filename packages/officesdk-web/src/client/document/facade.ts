import type { Client } from '@officesdk/rpc';
import type { DocumentMethods, DocumentSelection, EditorContent, DocumentZoom, RpcReturnProxy } from '../../shared';
import { createSelectionFacade } from './selection';
import { createContentFacade } from './content';
import { createZoomFacade } from './zoom';
export interface DocumentFacade {
  /**
   * 选区实例
   */
  readonly selection: RpcReturnProxy<DocumentSelection>;

  /**
   * 主动保存内容
   */
  readonly content: RpcReturnProxy<EditorContent>;

  /**
   * 缩放实例
   */
  readonly zoom: RpcReturnProxy<DocumentZoom>;

  // TODO: 初始化流程控制，初始化各类异常
}

export function createDocumentFacade(client: Client<DocumentMethods>): DocumentFacade {
  const { methods } = client;
  const selection = createSelectionFacade(methods);
  const content = createContentFacade(methods);
  const zoom = createZoomFacade(methods);
  return {
    get selection() {
      return selection;
    },
    get content() {
      return content;
    },
    get zoom() {
      return zoom;
    },
  };
}
