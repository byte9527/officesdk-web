import { createClient } from './client';
import { createClientFrame, createServerFrame } from './frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';
import { createOutput } from '../shared/output';

/**
 * Tests the basic connection scenario where client is created first
 * @param content - Container element for the test UI
 */
function testBasicConnection(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient({
    output: createOutput({
      container: createClientFrame(content),
    }),
    iframe,
  });
}

/**
 * Tests the scenario where iframe is preloaded before client connection
 * @param content - Container element for the test UI
 */
function testIframePreloading(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient({
    output: createOutput({
      container: createClientFrame(content),
    }),
    iframe,
  });
}

/**
 * Tests the scenario with multiple clients connecting to the same server
 * @param content - Container element for the test UI
 */
function testMultipleClients(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient({
    output: createOutput({
      container: createClientFrame(content),
    }),
    iframe,
  });

  createClient({
    output: createOutput({
      container: createClientFrame(content),
    }),
    iframe,
  });
}

/**
 * Test connections open cases.
 * @param root - Root container element for the test UI
 */
export function testOpen(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test basic connection');
  testBasicConnection(
    renderContent({
      height: 64,
    }),
  );

  renderTitle('Test iFrame preloading');
  testIframePreloading(
    renderContent({
      height: 64,
    }),
  );

  renderTitle('Test multiple clients');
  testMultipleClients(
    renderContent({
      height: 64,
    }),
  );
}
