import type { RPCMethods, RPCClientProxy, RPCServerProxy } from '@officesdk/rpc';

export interface RpcMethods extends RPCMethods {
  ping: () => string;
  // testCallback: (type: string, callback: (event: { type: string; data: unknown }) => void) => void;
}

export const proxyClient: RPCClientProxy<RpcMethods> = (context) => {
  const { invoke } = context;

  return {
    ping: () => invoke('ping'),
    // testCallback: (type: string, callback: (event: { type: string; data: unknown }) => void) => {
    //   invoke('testCallback', [type, callback]);
    // },
  };
};

export const serverProxy: RPCServerProxy<RpcMethods> = (context) => {
  return {
    ping: () => {
      return 'pong';
    },
    // testCallback: (type: string, callback: (event: { type: string; data: unknown }) => void) => {
    //   setTimeout(() => {
    //     callback({
    //       type,
    //       data: 'test',
    //     });
    //   });
    // },
  };
};
