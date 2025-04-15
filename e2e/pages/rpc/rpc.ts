import './rpc.css';

import { testOpen } from './open';
import { testMethods } from './methods';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  // testOpen(root);
  testMethods(root);
}

main();
