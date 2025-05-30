import type { Client, RPCReturnMapProxy } from '@officesdk/rpc';
import type { DocumentMethods, DocumentSelection, EditorContent, DocumentZoom,
  DocumentTOCs,
  DocumentOutline, 
  DocumentWindow} from '../../shared';
import { createSelectionFacade } from './selection';
import { createContentFacade } from '../editor/content';
import { createZoomFacade } from './zoom';
import { createTOCsFacade } from './tocs';
import { createOutlineFacade } from '../editor/outline';
import { createWindowFacade } from './window';

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

  /**
   * 目录实例
   */
  readonly TOCs: RPCReturnMapProxy<DocumentTOCs>;

  /**
   * 目录实例
   */
  readonly outline: RPCReturnMapProxy<DocumentOutline>;
  /**
   * 窗口实例
   */
  readonly window: RPCReturnMapProxy<DocumentWindow>

  // TODO: 初始化流程控制，初始化各类异常
}

export function createDocumentFacade(client: Client<DocumentMethods>): DocumentFacade {
  const { methods } = client;
  const selection = createSelectionFacade(methods);
  const content = createContentFacade(methods);
  const zoom = createZoomFacade(methods);
  const TOCs = createTOCsFacade(methods);
  const outline = createOutlineFacade<{ text: string }>(methods);
  const docxWindow = createWindowFacade(methods)
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
    get TOCs() {
      return TOCs;
    },
    get outline() {
      return outline;
    },
    get window() {
      return docxWindow
    }
  };
}
