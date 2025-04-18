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
 * Test getting worksheet information
 * @param content - Container element for test UI
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
 * Test getting worksheet by specified ID
 * @param content - Container element for test UI
 */
async function testGetWorksheetById(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get workbook...');
  const workbook = editor.workbook;

  // Get all worksheets first
  const worksheets = await workbook.getWorksheets();

  if (!worksheets.length) {
    throw new Error('No worksheets found');
  }

  // Get the ID of the first worksheet
  const firstSheetId = worksheets[0].id;
  output(`Try to get the worksheet with id ${firstSheetId}...`);

  // Get worksheet by ID
  const worksheet = await workbook.getWorksheetById(firstSheetId);

  if (!worksheet) {
    throw new Error('No worksheet found with the specified id');
  }

  output(`Successfully get the worksheet: ${worksheet.name}`);
}

/**
 * Test setting active worksheet
 * @param content - Container element for test UI
 */
async function testSetActiveWorksheet(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Get workbook...');
  const workbook = editor.workbook;

  // Get all worksheets
  const worksheets = await workbook.getWorksheets();

  if (!worksheets.length) {
    throw new Error('No worksheets found');
  }

  // Get current active worksheet
  const activeWorksheet = await workbook.getActiveWorksheet();
  output(`Current active worksheet: ${activeWorksheet.name}`);

  // Find a non-active worksheet
  const nonActiveWorksheet = worksheets.find((sheet) => !sheet.isActive);

  if (!nonActiveWorksheet) {
    throw new Error('No non-active worksheet found');
  }

  output(`Try to set the worksheet "${nonActiveWorksheet.name}" to active state...`);
  await workbook.setActiveWorksheet(nonActiveWorksheet.id);

  // Get active worksheet again to confirm the change
  const newActiveWorksheet = await workbook.getActiveWorksheet();
  output(`Current active worksheet has been changed to: ${newActiveWorksheet.name}`);
}
