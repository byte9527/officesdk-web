import { create } from '@officesdk/rpc';
import type { RemoteProxy } from 'penpal';

import { proxyClient } from './rpc';
import type { RpcMethods } from './rpc';

interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export async function createClient(options: ClientOptions): Promise<RemoteProxy<RpcMethods>> {
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

  const { id, methods } = await create<RpcMethods>({
    remoteWindow,
    proxy: proxyClient,
  });

  output?.(`Client created, id: ${id}`);

  return methods;
}
