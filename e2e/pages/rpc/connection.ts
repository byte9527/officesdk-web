import './connection.css';

import { testOpenConnections } from './open';
import { testMethods } from './methods';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testOpenConnections(root);
  testMethods(root);
}

main();
