import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';

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
      height: 1 + 21 * 8,
    }),
  );

  renderTitle('Test set range');
  testSetRange(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );

  renderTitle('Test add range listener');
  testAddRangeListener(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );
}

/**
 * Tests the basic connection scenario where client is created first
 * @param content - Container element for the test UI
 */
async function testGetRange(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

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
}

async function testAddRangeListener(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Adding range listener...');
  const selection = editor.selection;

  selection.addRangeListener((range) => {
    if (range) {
      output(`Range changed: ${range.start} - ${range.end}`);
    }
  });
}

async function testSetRange(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Setting range...');

  const selection = editor.selection;

  await selection.setRange({
    start: '1',
    end: '2',
  });

  output('Range set');
}
