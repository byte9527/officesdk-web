import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';

/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export function testContent(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test save content');
  testSaveContent(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );

  renderTitle('Test content listener');
  testContentListener(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );
}

/**
 * 测试保存内容
 * @param content - 测试 UI 的容器元素
 */
async function testSaveContent(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('保存文档内容...');
  const editorContent = editor.content;
  await editorContent.save();
  output('文档内容已保存');
}

/**
 * 测试内容变化监听
 * @param content - 测试 UI 的容器元素
 */
async function testContentListener(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('添加内容变化监听器...');
  const editorContent = editor.content;

  await editorContent.addContentListener((record) => {
    output(`文档内容已变化：
    - 时间戳：${record.timestamp}
    - 内容ID：${record.id}`);
  });

  output('内容变化监听器已添加');
}
