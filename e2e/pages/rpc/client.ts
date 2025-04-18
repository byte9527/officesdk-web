import { create } from '@shimo/officesdk-rpc';
import type { RPCReturnMethods } from '@shimo/officesdk-rpc';

import { createClientProxy } from './proxies';
import type { TestMethods } from './proxies';

interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export async function createClient(options: ClientOptions): Promise<RPCReturnMethods<TestMethods>> {
  const { output, iframe } = options;

  output?.('Start testing rpc client.');

  // TODO: 接入 debug

  let remoteWindow: Window;

  if (iframe.contentWindow) {
    remoteWindow = iframe.contentWindow;
  } else {
    remoteWindow = await new Promise((resolve, reject) => {
      iframe.addEventListener(
        'load',
        () => {
          const contentWindow = iframe.contentWindow;
          if (contentWindow) {
            resolve(contentWindow);
          } else {
            // TODO: Error handling
            reject(new Error('Failed to load iframe'));
          }
        },
        { once: true },
      );

      iframe.addEventListener(
        'error',
        () => {
          // TODO: Error handling
          reject(new Error('Failed to load iframe'));
        },
        { once: true },
      );
    });
  }

  output?.('Creating client...');

  const { id, methods } = await create({
    remoteWindow,
    proxy: createClientProxy(output),
  });

  output?.(`Client created, id: ${id}`);

  return methods;
}
