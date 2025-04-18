import { testSDK } from './tests/sdk';
import { testContent } from './tests/content';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testSDK(root);
  testContent(root);
  // TODO: other apis
}

main();
