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
        mapArgs: (args, context) => {
          return {
            args: [args[0], context.createReference('callback', args[1])],
            references: [[1, 'callback']],
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
    testCallbackArg: (type: string, callback: (event: { type: string; data: unknown }) => void) => {
      setTimeout(() => {
        callback({
          type,
          data: 'test',
        });
      });
    },
  };
};
