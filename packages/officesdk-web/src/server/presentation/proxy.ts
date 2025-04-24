import type { RPCServerProxy } from '@shimo/officesdk-rpc';

import type { EditorContext } from '../editor';
import type { PresentationMethods, PresentationEditor } from '../../shared';
import { createEditorContentProxy } from '../editor/content';
import { createPresentationZoomProxy } from './zoom';
import { createPresentationSelectionProxy } from './selection';
import { createPresentationSlidesProxy } from './slides';

/**
 * 定义幻灯片的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPresentationProxy(
  editor: PresentationEditor,
  context?: EditorContext,
): RPCServerProxy<PresentationMethods> {
  return () => {
    return {
      /**
       * 获取选区接口
       */
      getSelection: () => {
        return createPresentationSelectionProxy(editor.selection);
      },

      /**
       * 获取内容接口
       */
      getContent: () => {
        if (!context?.content) {
          throw new Error('Context content is not provided');
        }

        return createEditorContentProxy(context.content);
      },

      /**
       * 获取当前幻灯片的缩放接口
       */
      getZoom: () => {
        return createPresentationZoomProxy(editor.zoom);
      },

      /**
       * 获取幻灯片集合接口
       */
      getSlides: () => {
        return createPresentationSlidesProxy(editor.slides);
      },
    };
  };
}
