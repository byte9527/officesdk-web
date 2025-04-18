import type { RPCServerProxy } from '@officesdk/rpc';
import type { PresentationMethods, PresentationEditor } from '../../shared';
import { createEditorContentProxy } from '../editor/content';
import { createPresentationZoomProxy } from './zoom';

/**
 * 定义幻灯片的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPresentationProxy(editor: PresentationEditor): RPCServerProxy<PresentationMethods> {
  return () => {
    return {
      /**
       * 获取选区接口
       */
      getSelection: () => {
        return editor.selection;
      },

      /**
       * 获取内容接口
       */
      getContent: () => {
        return createEditorContentProxy(editor.content);
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
        return editor.slides;
      },
    };
  };
}
