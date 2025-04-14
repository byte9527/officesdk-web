import { createClient } from './client';
import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';
import { createOutput } from '../shared/output';

/**
 * Test document sdk cases.
 * @param root - Root container element for the test UI
 */
export function testSDK(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test basic connection');
  testConnect(
    renderContent({
      height: 85,
    }),
  );
}

/**
 * Tests the basic connection scenario where client is created first
 * @param content - Container element for the test UI
 */
async function testConnect(content: HTMLElement): Promise<void> {
  const iframe = createServerFrame(content, 'documentServer');
  const container = createContainerFrame(content);
  const output = createOutput({
    container,
  });

  const sdk = createClient({
    output,
    iframe,
  });

  output('Connecting...');

  await sdk.connect();

  output('Connected');
}
