import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';

/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export async function testCell(root: HTMLElement): Promise<void> {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test active cell');
  await testActiveCell(
    renderContent({
      height: 1 + 21 * 8,
    }),
  );
}

/**
 * Tests the basic connection scenario where client is created first
 * @param content - Container element for the test UI
 */
async function testActiveCell(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get active cell...');
  const activeCell = await editor.activeCell;

  output(`Active cell: ${activeCell?.row},${activeCell?.column}`);

  output('Get cell text...');
  const cellText = await activeCell?.getCellText();
  output(`Cell text: ${cellText}`);

  output('Get cell value...');
  const cellValue = await activeCell?.getCellValue();
  output(`Cell value: ${cellValue}`);
}
