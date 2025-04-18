import { createEditor } from '../client';
import { createRenderTitle, createRenderContent } from '../../shared/renderer';

/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export async function testContent(root: HTMLElement): Promise<void> {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test save content');
  await testSaveContent(
    renderContent({
      height: 1 + 21 * 4,
    }),
  );

  renderTitle('Test content listener');
  await testContentListener(
    renderContent({
      height: 1 + 21 * 5,
    }),
  );
}

/**
 * Test saving content
 * @param content - Container element for test UI
 */
async function testSaveContent(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Saving document content...');
  const editorContent = editor.content;
  await editorContent.save();
  output('Document content has been saved');
}

/**
 * Test content change listener
 * @param content - Container element for test UI
 */
async function testContentListener(content: HTMLElement): Promise<void> {
  const { editor, output } = await createEditor(content);

  output('Adding content change listener...');
  const editorContent = editor.content;

  await editorContent.addContentListener((record) => {
    output(`Document content has changed:
    - Timestamp: ${record.timestamp}
    - Content ID: ${record.id}`);
  });

  output('Content change listener has been added');
}
