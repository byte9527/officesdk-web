import type { RemoteProxy } from 'penpal';

import { createClient } from './client';
import { createContainerFrame, createServerFrame } from './frames';
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
  testCallback(
    renderContent({
      height: 85,
    }),
  );

  renderTitle('Test race condition');
  testRaceCondition(
    renderContent({
      height: 85,
    }),
  );
}

async function getServerMethods(
  iframe: HTMLIFrameElement,
  output: (message: string) => void,
): Promise<RemoteProxy<TestMethods>> {
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
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content), output);

  let callPromise = methods.testInvoke();

  output?.('Calling remote method: .ping');

  const result = await callPromise;

  output?.(`Server response: ${result}`);
}

async function testCallback(content: HTMLElement, type?: string): Promise<void> {
  const output = createOutput({
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content), output);

  output('Calling remote method: .testCallback');

  await new Promise<void>((resolve) => {
    methods.testCallbackArg('foo', (event) => {
      output(`Received event: ${event.type}, data: ${event.data}`);
      resolve();
    });
  });
}

async function testRaceCondition(content: HTMLElement): Promise<void> {
  const iframe = createServerFrame(content);

  const output1 = createOutput({
    container: createContainerFrame(content),
  });
  const output2 = createOutput({
    container: createContainerFrame(content),
  });

  const methods1 = await getServerMethods(iframe, output1);
  const methods2 = await getServerMethods(iframe, output2);

  output1('Calling remote method: .testCallback by client 1');
  output2('Calling remote method: .testCallback by client 2');

  methods1.testCallbackArg('client 1', (event) => {
    output1(`Received event: ${event.type}, data: ${event.data}`);
  });

  methods2.testCallbackArg('client 2', (event) => {
    output2(`Received event: ${event.type}, data: ${event.data}`);
  });
}
