import { serve } from '@officesdk/rpc';

import { createOutput } from '../shared/output';

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  const output = createOutput({
    container: root,
  });

  output('Start testing rpc server.');

  const clientIds = await serve();

  output(`Server started, found clients: ${clientIds.join(', ')}`);
}

main();
