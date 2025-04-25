import { serve } from '@shimo/officesdk-rpc';

import { createServerProxy } from './proxies';
import type { TestMethods, TestOptions } from './proxies';
import { createOutput } from '../shared/output';
import { createRenderContent } from '../shared/renderer';
import { createContainerFrame } from '../shared/frames';

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  const renderContent = createRenderContent({ container: root });

  const content = renderContent();

  const output = createOutput({
    container: createContainerFrame(content),
  });

  output('Start testing rpc server.');

  const server = await serve<TestMethods, TestOptions>({
    proxy: createServerProxy(output),
  });

  output(
    server.getClientIds().length > 0
      ? `Server started, found clients: ${server.getClientIds().join(', ')}`
      : 'Server started, no clients found',
  );

  server.addClientListener((event, payload) => {
    if (event === 'add') {
      output(`Client ${payload.clientId} connected.`);
    } else if (event === 'delete') {
      output(`Client ${payload.clientId} disconnected.`);
    }
  });
}

main();
