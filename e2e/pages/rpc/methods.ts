import { createClient } from './client';
import { createServerFrame } from './frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';

/**
 * Tests the basic methods calling scenario.
 * @param root - Root container element for the test UI
 */
export function testMethods(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test methods');
  testBasicMethods(
    renderContent({
      height: 64,
    }),
  );
}

/**
 * Tests the basic methods calling scenario.
 * @param content - Container element for the test UI
 */
function testBasicMethods(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient(content, iframe);
}
