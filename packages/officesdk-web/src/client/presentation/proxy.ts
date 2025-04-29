import type { RPCClientProxy } from '@officesdk/rpc';
import type { PresentationMethods } from '../../shared';

/**
 * 定义 Presentation 的 RPC 代理的客户端调用接口
 * @returns
 */
export function createPresentationProxy(): RPCClientProxy<PresentationMethods> {
  return (context) => {
    const { invoke } = context;

    return {
      /**
       * 获取选区接口
       */
      getSelection: async () => {
        return invoke('getSelection', []);
      },

      /**
       * 获取内容接口
       */
      getContent: async () => {
        return invoke('getContent', []);
      },

      /**
       * 获取当前幻灯片的缩放接口
       */
      getZoom: async () => {
        return invoke('getZoom', []);
      },

      /**
       * 获取幻灯片集合接口
       */
      getSlides: async () => {
        return invoke('getSlides', []);
      },
    };
  };
}
