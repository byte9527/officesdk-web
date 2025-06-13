import type { RPCServerProxy } from '@officesdk/rpc';

import type { EditorContext } from '../editor';
import type { PresentationMethods, PresentationEditor, PresentationSDKOptions } from '../../shared';
import { createEditorContentProxy } from '../editor/content';
import { createPresentationZoomProxy } from './zoom';
import { createPresentationSelectionProxy } from './selection';
import { createPresentationSlidesProxy } from './slides';

export type PresentationEditorFactory = (options: PresentationSDKOptions | null) => Promise<PresentationEditor>;

export type PresentationContextFactory = (editor: PresentationEditor) => Promise<EditorContext>;

/**
 * 定义幻灯片的 RPC 代理的服务端调用接口
 * @returns
 */
export function createPresentationProxy(
  createEditor: PresentationEditorFactory,
  createContext?: PresentationContextFactory,
): RPCServerProxy<PresentationMethods, PresentationSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    console.log('context', context);

    return {
      ready: async ():Promise<void> => {
         return editor.ready();
      },
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
