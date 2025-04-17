import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';
/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export async function testZoom(root: HTMLElement): Promise<void> {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test zoom');
  await testGetZoom(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );

  renderTitle('Test set zoom');
  await testSetZoom(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );

  renderTitle('Test zoom in out');
  await testZoomInOut(
    renderContent({
      height: 1 + 21 * 6,
    }),
  );

  renderTitle('Test fit mode');
  await testFitMode(
    renderContent({
      height: 1 + 21 * 10,
    }),
  );
}

/**
 * Test getting zoom percentage
 * @param content - Test UI container element
 */
async function testGetZoom(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Getting current zoom percentage...');
  const zoom = editor.zoom;
  const percentage = await zoom.getPercentage();
  output(`Current zoom percentage: ${percentage}%`);
}

/**
 * Test setting zoom percentage
 * @param content - Test UI container element
 */
async function testSetZoom(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Setting zoom percentage...');
  const zoom = editor.zoom;

  // Test setting zoom percentage within valid range
  await zoom.setPercentage(150);
  output('Zoom percentage set to 150%');

  const percentage = await zoom.getPercentage();
  output(`Current zoom percentage: ${percentage}%`);
}

/**
 * Test zoom in and zoom out functions
 * @param content - Test UI container element
 */
async function testZoomInOut(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  const zoom = editor.zoom;

  output('Testing zoom in function...');
  await zoom.zoomIn();
  let percentage = await zoom.getPercentage();
  output(`Zoom percentage after zooming in: ${percentage}%`);

  output('Testing zoom out function...');
  await zoom.zoomOut();
  percentage = await zoom.getPercentage();
  output(`Zoom percentage after zooming out: ${percentage}%`);
}

/**
 * Test zoom fit modes
 * @param content - Test UI container element
 */
async function testFitMode(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  const zoom = editor.zoom;

  output('Testing get current fit mode...');
  let mode = await zoom.getFitMode();
  output(`Current fit mode: ${mode}`);

  output('Testing set window fit mode...');
  await zoom.setFitMode('window');
  mode = await zoom.getFitMode();
  output(`Fit mode after setting: ${mode}`);

  output('Testing set page fit mode...');
  await zoom.setFitMode('page');
  mode = await zoom.getFitMode();
  output(`Fit mode after setting: ${mode}`);

  output('Testing set none fit mode...');
  await zoom.setFitMode('none');
  mode = await zoom.getFitMode();
  output(`Fit mode after setting: ${mode}`);
}
