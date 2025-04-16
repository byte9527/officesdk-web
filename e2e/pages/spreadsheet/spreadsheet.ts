import { testSDK } from './tests/sdk';
import { testSelection } from './tests/selection';
import { testContent } from './tests/content';
import { testWorkbook } from './tests/workbook';
import { testWorksheet } from './tests/worksheet';

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  testSDK(root);
  testSelection(root);
  testContent(root);
  testWorkbook(root);
  testWorksheet(root);
}

main();
