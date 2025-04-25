import type { RPCServerProxy } from '@shimo/officesdk-rpc';
import type { LiteDocMethods, LiteDocEditor, LiteDocSDKOptions } from '../../shared';
import type { EditorContext } from '../editor';

export type LiteDocEditorFactory = (options: LiteDocSDKOptions | null) => Promise<LiteDocEditor>;

export type LiteDocContextFactory = (editor: LiteDocEditor) => Promise<EditorContext>;

/**
 * 定义轻文档的 RPC 代理的服务端调用接口
 * @returns
 */
export function createLiteDocProxy(
  createEditor: LiteDocEditorFactory,
  createContext?: LiteDocContextFactory,
): RPCServerProxy<LiteDocMethods, LiteDocSDKOptions> {
  return async (options) => {
    const editor = await createEditor(options);
    const context = await createContext?.(editor);

    console.log('context', context);
    return {};
  };
}
