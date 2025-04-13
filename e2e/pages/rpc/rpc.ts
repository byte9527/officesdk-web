import type { RPCClientProxy, RPCServerProxy } from '@officesdk/rpc';
import { ReferenceType } from '@officesdk/rpc';

export type TestMethods = {
  testInvoke: () => string;
  testCallbackArg: (type: string, callback: (event: { type: string; data: unknown }) => void) => void;
  testNestedCallback: (options: { type: string; callback: (event: { type: string; data: unknown }) => void }) => void;
};

/**
 * 这部分代码会在客户端环境中执行
 * @param context
 * @returns
 */
export const createClientProxy: (output?: (message: string) => void) => RPCClientProxy<TestMethods> =
  () => (context) => {
    const { invoke } = context;

    return {
      testInvoke: () => {
        return invoke('testInvoke', []);
      },
      testCallbackArg: (type, callback) => {
        return invoke('testCallbackArg', [type, callback], {
          mapArgs: (args, context) => {
            return {
              args: [
                args[0],
                context.createReference({
                  type: 'callback',
                  value: args[1],
                }),
              ],
              references: [[1, ReferenceType.Callback]],
            };
          },
        });
      },
      testNestedCallback(options) {
        return invoke('testNestedCallback', [options], {
          mapArgs: (args, context) => {
            const [options] = args;
            return {
              args: [
                {
                  type: options.type,
                  callback: context.createReference({
                    type: 'callback',
                    value: options.callback,
                  }),
                },
              ],
              references: [[0, ReferenceType.Callback, 'callback']],
            };
          },
        });
      },
    };
  };

/**
 * 这部分代码会在服务端环境中执行
 * @returns
 */
export const createServerProxy: (output?: (message: string) => void) => RPCServerProxy<TestMethods> =
  (output) => () => {
    return {
      testInvoke: () => {
        return 'pong';
      },
      testCallbackArg: (type: string, callback: (event: { type: string; data: unknown }) => void) => {
        output?.('Server .testCallbackArg has been invoked with type: ' + type);

        setTimeout(() => {
          output?.('Server invoked callback.');
          callback({
            type,
            data: 'bar',
          });
        });
      },
      testNestedCallback: (options) => {
        output?.('Server .testNestedCallback has been invoked with type: ' + options.type);

        setTimeout(() => {
          output?.('Server invoked callback.');
          options.callback({
            type: options.type,
            data: 'bar',
          });
        });
      },
    };
  };
