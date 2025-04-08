import { serve } from '@officesdk/rpc';

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

  const clientIds = await serve();

  output(`Server started, found clients: ${clientIds.join(', ')}`);
}

main();
