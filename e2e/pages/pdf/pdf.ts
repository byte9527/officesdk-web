import { testSDK } from './tests/sdk';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testSDK(root);
  // TODO: other apis
}

main();
