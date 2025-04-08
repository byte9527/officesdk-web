import { create } from '@officesdk/rpc';

import { createOutput } from '../shared/output';
import { createClientFrame } from './frames';

export async function createClient(content: HTMLElement, iframe: HTMLIFrameElement): Promise<void> {
  const container = createClientFrame(content);

  const output = createOutput({
    container,
  });

  output('Start testing rpc client.');

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

  output('Creating client...');

  const { id } = await create({
    remoteWindow: remoteWindow,
  });

  output(`Client created, id: ${id}`);
}
