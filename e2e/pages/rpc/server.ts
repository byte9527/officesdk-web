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

  const clientIds = await serve<TestMethods>({
    proxy: createServerProxy(output),
  });

  output(`Server started, found clients: ${clientIds.join(', ')}`);
}

main();
