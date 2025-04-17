import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';
/**
 * Test spreadsheet selections cases.
 * @param root - Root container element for the test UI
 */
export async function testSelections(root: HTMLElement): Promise<void> {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test selections');
  await testGetSelections(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );

  renderTitle('Test set selections');
  await testSetSelections(
    renderContent({
      height: 1 + 21 * 6,
    }),
  );
}

/**
 * 测试获取选区信息
 * @param content - 测试 UI 的容器元素
 */
async function testGetSelections(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get current selections...');
  const selections = await editor.selections;

  if (!selections?.length) {
    throw new Error('No selections found');
  }

  output(`Selections count: ${selections.length}`);

  // 获取第一个选区的信息
  const firstSelection = selections[0];
  const range = await firstSelection.getRange();

  if (!range) {
    throw new Error('No range found');
  }

  output(
    `First selection: from ${range.row},${range.column} to ${range.row + range.rowCount - 1},${range.column + range.columnCount - 1}`,
  );
}

/**
 * 测试设置选区信息
 * @param content - 测试 UI 的容器元素
 */
async function testSetSelections(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Set selections...');
  const selections = await editor.selections;

  if (!selections?.length) {
    throw new Error('No selections found');
  }

  const firstSelection = selections[0];
  const range = await firstSelection.getRange();

  if (!range) {
    throw new Error('No range found');
  }

  output('Set range...');

  await firstSelection.setRange({
    type: range.type,
    row: range.row + 10,
    column: range.column + 10,
    rowCount: range.rowCount,
    columnCount: range.columnCount,
  });

  output('Get new range...');
  const newRange = await firstSelection.getRange();

  if (!newRange) {
    throw new Error('No range found');
  }

  output(`New range: from ${range.row},${range.column} to ${newRange.row},${newRange.column}`);
}
