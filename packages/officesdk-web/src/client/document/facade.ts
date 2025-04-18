import type { Client, RPCReturnMapProxy } from '@shimo/officesdk-rpc';
import type { DocumentMethods, DocumentSelection, EditorContent, DocumentZoom } from '../../shared';
import { createSelectionFacade } from './selection';
import { createContentFacade } from '../editor/content';
import { createZoomFacade } from './zoom';
export interface DocumentFacade {
  /**
   * 选区实例
   */
  readonly selection: RPCReturnMapProxy<DocumentSelection>;

  /**
   * 主动保存内容
   */
  readonly content: RPCReturnMapProxy<EditorContent>;

  /**
   * 缩放实例
   */
  readonly zoom: RPCReturnMapProxy<DocumentZoom>;

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
