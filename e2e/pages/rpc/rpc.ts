import type { RPCClientProxy, RPCServerProxy } from '@officesdk/rpc';
import type { TransportableRules } from '@officesdk/rpc';

export type TestMethods = {
  testInvoke: () => string;
  testCallbackArg: (type: string, callback: (event: { type: string; data: unknown }) => void) => void;
  testNestedCallback: (options: { type: string; callback: (event: { type: string; data: unknown }) => void }) => void;
  testCallbackReturn: (type: string) => (event: { data: unknown }) => string;
  testNestedReturn: (type: string) => {
    baz: string;
    callback: (event: { data: unknown }) => string;
    element: HTMLElement;
  };
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
          transformArgs: () => {
            const rules: TransportableRules[] = [
              // args[0]
              [
                {
                  type: 'data',
                },
              ],
              // args[1]
              [
                {
                  type: 'callback',
                  path: 'callback',
                },
              ],
            ];

            return {
              rules,
            };
          },
        });
      },
      testNestedCallback(options) {
        return invoke('testNestedCallback', [options], {
          transformArgs: () => {
            const rules: TransportableRules[] = [
              // args[0]
              [
                {
                  type: 'callback',
                  path: 'callback',
                },
              ],
            ];

            return {
              rules,
            };
          },
        });
      },
      testCallbackReturn(type) {
        return invoke('testCallbackReturn', [type], {});
      },
      testNestedReturn(type) {
        return invoke('testNestedReturn', [type], {});
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
        output?.('Server .testInvoke has been invoked.');
        return {
          value: 'pong',
        };
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
      testCallbackReturn: (type) => {
        output?.('Server .testCallbackReturn has been invoked with type: ' + type);

        return {
          value: (event: { data: unknown }) => {
            output?.('Server callback has been invoked with event: ' + JSON.stringify(event));
            return 'qux';
          },
          rules: [
            {
              type: 'callback',
            },
          ],
        };
      },
      testNestedReturn(type) {
        output?.('Server .testNestedReturn has been invoked with type: ' + type);

        return {
          value: {
            baz: 'qux',
            callback: (event: { data: unknown }) => {
              output?.('Server callback has been invoked with event: ' + JSON.stringify(event));
              return 'qux';
            },
            element: document.createElement('div'),
          },
          rules: [
            {
              type: 'callback',
              path: 'callback',
            },
            {
              type: 'any',
              path: 'element',
            },
          ],
        };
      },
    };
  };
