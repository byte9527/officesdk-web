import { createClient } from './client';
import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';
import { createOutput } from '../shared/output';

/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export function testSelection(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test selection');
  testGetRange(
    renderContent({
      height: 1 + 21 * 10,
    }),
  );
}

/**
 * Tests the basic connection scenario where client is created first
 * @param content - Container element for the test UI
 */
async function testGetRange(content: HTMLElement): Promise<void> {
  const iframe = createServerFrame(content, 'documentServer');
  const container = createContainerFrame(content);
  const output = createOutput({
    container,
  });

  const sdk = createClient({
    output,
    iframe,
  });

  const editor = await sdk.connect();

  output('Getting selection...');

  const selection = editor.selection;

  const range = await selection.getRange();

  if (!range) {
    throw new Error('Failed to get selection range');
  }

  output(`Received selection: ${range.start} - ${range.end}`);

  output('Getting text from range...');
  const text = await range.getText();
  output(`Received text: ${text}`);

  output('Getting html from range...');
  const html = await range.getHtml();
  output(`Received html: ${html}`);

  output('Adding range listener...');
  selection.addRangeListener((range) => {
    output(`Range changed: ${range.start} - ${range.end}`);
  });
}
