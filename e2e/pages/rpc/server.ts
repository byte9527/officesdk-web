import { serve } from '@officesdk/rpc';

import { createServerProxy } from '../rpc/rpc';
import type { TestMethods } from '../rpc/rpc';
import { createOutput } from '../shared/output';
import { createRenderContent } from '../shared/renderer';

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  const renderContent = createRenderContent({ container: root });

  const output = createOutput({
    container: renderContent(),
  });

  output('Start testing rpc server.');

  const clientIds: Set<string> = new Set();

  let started = false;

  const foundClientIds = await serve<TestMethods>({
    proxy: createServerProxy(output),
    onOpen: (clientId) => {
      if (!started) {
        return;
      }

      clientIds.add(clientId);
      output(`Client ${clientId} connected.`);
    },
    onClose: (clientId) => {
      if (!started) {
        return;
      }

      clientIds.delete(clientId);
      output(`Client ${clientId} disconnected.`);
    },
  });

  started = true;

  output(
    foundClientIds.length > 0
      ? `Server started, found clients: ${foundClientIds.join(', ')}`
      : 'Server started, no clients found',
  );
}

main();
