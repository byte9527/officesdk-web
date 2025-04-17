import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';

/**
 * Test spreadsheet workbook cases.
 * @param root - Root container element for the test UI
 */
export async function testWorkbook(root: HTMLElement): Promise<void> {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test get worksheets');
  await testGetWorksheets(
    renderContent({
      height: 1 + 21 * 7,
    }),
  );

  renderTitle('Test get worksheet by id');
  await testGetWorksheetById(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );

  renderTitle('Test set activeWorksheet');
  await testSetActiveWorksheet(
    renderContent({
      height: 1 + 21 * 6,
    }),
  );
}

/**
 * 测试获取工作表信息
 * @param content - 测试 UI 的容器元素
 */
async function testGetWorksheets(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get workbook...');
  const workbook = editor.workbook;

  output('Get all worksheets...');
  const worksheets = await workbook.getWorksheets();
  output(`Worksheets count: ${worksheets.length}`);

  if (!worksheets.length) {
    throw new Error('No worksheets found');
  }

  output('Get active worksheet...');
  const activeWorksheet = await workbook.getActiveWorksheet();
  output(`Active worksheet name: ${activeWorksheet.name}`);
}

/**
 * 测试获取指定ID的工作表
 * @param content - 测试 UI 的容器元素
 */
async function testGetWorksheetById(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get workbook...');
  const workbook = editor.workbook;

  // 先获取所有工作表
  const worksheets = await workbook.getWorksheets();

  if (!worksheets.length) {
    throw new Error('No worksheets found');
  }

  // 获取第一个工作表的ID
  const firstSheetId = worksheets[0].id;
  output(`Try to get the worksheet with id ${firstSheetId}...`);

  // 根据ID获取工作表
  const worksheet = await workbook.getWorksheetById(firstSheetId);

  if (!worksheet) {
    throw new Error('No worksheet found with the specified id');
  }

  output(`Successfully get the worksheet: ${worksheet.name}`);
}

/**
 * 测试设置活动工作表
 * @param content - 测试 UI 的容器元素
 */
async function testSetActiveWorksheet(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get workbook...');
  const workbook = editor.workbook;

  // 获取所有工作表
  const worksheets = await workbook.getWorksheets();

  if (!worksheets.length) {
    throw new Error('No worksheets found');
  }

  // 获取当前活动工作表
  const activeWorksheet = await workbook.getActiveWorksheet();
  output(`Current active worksheet: ${activeWorksheet.name}`);

  // 寻找一个非活动工作表
  const nonActiveWorksheet = worksheets.find((sheet) => !sheet.isActive);

  if (!nonActiveWorksheet) {
    throw new Error('No non-active worksheet found');
  }

  output(`Try to set the worksheet "${nonActiveWorksheet.name}" to active state...`);
  await workbook.setActiveWorksheet(nonActiveWorksheet.id);

  // 重新获取活动工作表确认更改
  const newActiveWorksheet = await workbook.getActiveWorksheet();
  output(`Current active worksheet has been changed to: ${newActiveWorksheet.name}`);
}
