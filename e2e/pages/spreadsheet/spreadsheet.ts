import { testSDK } from './tests/sdk';
import { testWorkbook } from './tests/workbook';
import { testSelections } from './tests/selections';
import { testCell } from './tests/cell';
import { testContent } from './tests/content';

async function main(): Promise<void> {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  await testSDK(root);
  await testWorkbook(root);
  await testSelections(root);
  await testContent(root);
  await testCell(root);
  await testWorkbook(root);
  // testWorksheet(root);
}

main();
