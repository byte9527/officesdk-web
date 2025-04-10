import type { RPCClientProxy, RPCServerProxy } from '@officesdk/rpc';

export type TestMethods = {
  testInvoke: () => string;
  testCallbackArg: (type: string, callback: (event: { type: string; data: unknown }) => void) => void;
};

export const proxyClient: RPCClientProxy<TestMethods> = (context) => {
  const { invoke } = context;

  return {
    testInvoke: () => {
      return invoke('testInvoke', []);
    },
    testCallbackArg: (type, callback) => {
      return invoke('testCallbackArg', [type, callback], {
        mapArgs: (args) => {
          return {
            args: [args[0]],
            references: {
              paths: [[1]],
            },
          };
        },
      });
    },
  };
};

export const serverProxy: RPCServerProxy<TestMethods> = (context) => {
  return {
    testInvoke: () => {
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
