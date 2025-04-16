import { testSDK } from './tests/sdk';
import { testSelection } from './tests/selection';
import { testZoom } from './tests/zoom';
import { testContent } from './tests/content';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testSDK(root);
  testSelection(root);
  testZoom(root);
  testContent(root);
}

main();
