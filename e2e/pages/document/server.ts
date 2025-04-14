import { FileType } from '@officesdk/web';
import { serveSDK } from '@officesdk/web/server';

// import { createServerProxy } from './proxies';
// import type { TestMethods } from './proxies';
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

  output('Creating document server...');

  const server = await serveSDK({
    fileType: FileType.Document,
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
