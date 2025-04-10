import type { RemoteProxy } from 'penpal';

import { createClient } from './client';
import { createClientFrame, createServerFrame } from './frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';
import { createOutput } from '../shared/output';
import type { TestMethods } from './rpc';

/**
 * Tests the basic methods calling scenario.
 * @param root - Root container element for the test UI
 */
export function testMethods(root: HTMLElement): void {
  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Test basic methods');
  testBasicMethods(
    renderContent({
      height: 85,
    }),
  );

  renderTitle('Test callback');
  testCallback(renderContent());
}

async function getServerMethods(
  content: HTMLElement,
  output: (message: string) => void,
): Promise<RemoteProxy<TestMethods>> {
  const iframe = createServerFrame(content);

  output('Start creating client...');

  const methods = await createClient({
    iframe,
  });

  output('Client created.');

  return methods;
}
/**
 * Tests the basic methods calling scenario.
 * @param content - Container element for the test UI
 */
async function testBasicMethods(content: HTMLElement): Promise<void> {
  const output = createOutput({
    container: createClientFrame(content),
  });

  const methods = await getServerMethods(content, output);

  let callPromise = methods.testInvoke();

  output?.('Calling remote method: .ping');

  const result = await callPromise;

  output?.(`Server response: ${result}`);
}

async function testCallback(content: HTMLElement): Promise<void> {
  const output = createOutput({
    container: createClientFrame(content),
  });

  const methods = await getServerMethods(content, output);

  output('Calling remote method: .testCallback');

  await new Promise<void>((resolve) => {
    methods.testCallbackArg('foo', (event) => {
      output(`Received event: ${event.type}, data: ${event.data}`);
      resolve();
    });
  });
}
