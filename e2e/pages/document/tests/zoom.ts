import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';
/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export function testZoom(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test zoom');
  testGetZoom(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );

  renderTitle('Test set zoom');
  testSetZoom(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );

  renderTitle('Test zoom in out');
  testZoomInOut(
    renderContent({
      height: 1 + 21 * 6,
    }),
  );

  renderTitle('Test fit mode');
  testFitMode(
    renderContent({
      height: 1 + 21 * 10,
    }),
  );
}

/**
 * 测试获取缩放比例
 * @param content - 测试 UI 的容器元素
 */
async function testGetZoom(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('获取当前缩放比例...');
  const zoom = editor.zoom;
  const percentage = await zoom.getPercentage();
  output(`当前缩放比例: ${percentage}%`);
}

/**
 * 测试设置缩放比例
 * @param content - 测试 UI 的容器元素
 */
async function testSetZoom(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('设置缩放比例...');
  const zoom = editor.zoom;

  // 测试设置有效范围内的缩放比例
  await zoom.setPercentage(150);
  output('缩放比例设置为 150%');

  const percentage = await zoom.getPercentage();
  output(`当前缩放比例: ${percentage}%`);
}

/**
 * 测试放大和缩小功能
 * @param content - 测试 UI 的容器元素
 */
async function testZoomInOut(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  const zoom = editor.zoom;

  output('测试放大功能...');
  await zoom.zoomIn();
  let percentage = await zoom.getPercentage();
  output(`放大后的缩放比例: ${percentage}%`);

  output('测试缩小功能...');
  await zoom.zoomOut();
  percentage = await zoom.getPercentage();
  output(`缩小后的缩放比例: ${percentage}%`);
}

/**
 * 测试缩放适应模式
 * @param content - 测试 UI 的容器元素
 */
async function testFitMode(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  const zoom = editor.zoom;

  output('测试获取当前缩放模式...');
  let mode = await zoom.getFitMode();
  output(`当前缩放模式: ${mode}`);

  output('测试设置窗口适应模式...');
  await zoom.setFitMode('window');
  mode = await zoom.getFitMode();
  output(`设置后的缩放模式: ${mode}`);

  output('测试设置页面适应模式...');
  await zoom.setFitMode('page');
  mode = await zoom.getFitMode();
  output(`设置后的缩放模式: ${mode}`);

  output('测试设置无自动缩放模式...');
  await zoom.setFitMode('none');
  mode = await zoom.getFitMode();
  output(`设置后的缩放模式: ${mode}`);
}
