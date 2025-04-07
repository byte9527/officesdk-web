import { create } from '@officesdk/rpc';

import { createOutput } from '../shared/output';
import { createClientFrame } from './frames';

export async function createClient(iframe: HTMLIFrameElement): Promise<void> {
  const container = createClientFrame();

  const output = createOutput({
    container,
  });

  output('Start testing rpc client.');

  // TODO: 接入 debug

  const target = iframe.contentWindow;

  if (!target) {
    output('Server not exists.');
    throw new Error('Server not exists');
  }

  output('Creating client...');

  await create({
    target,
  });

  output('Client created.');
}
