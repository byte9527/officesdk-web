import { testSDK } from './sdk';
import { testSelection } from './selection';
// import { testContent } from './content';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testSDK(root);
  testSelection(root);
}

main();
