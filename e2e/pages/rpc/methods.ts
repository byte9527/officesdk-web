import type { RemoteProxy } from '@officesdk/rpc';

import { createClient } from './client';
import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';
import { createOutput } from '../shared/output';
import type { TestMethods } from './proxies';

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

  // renderTitle('Test race condition');
  // testRaceCondition(
  //   renderContent({
  //     height: 85,
  //   }),
  // );

  // renderTitle('Test nested callback');
  // testNestedCallback(
  //   renderContent({
  //     height: 85,
  //   }),
  // );

  // renderTitle('Test callback return');
  // testCallbackReturn(
  //   renderContent({
  //     height: 106,
  //   }),
  // );

  // renderTitle('Test nested return');
  // testNestedReturn(
  //   renderContent({
  //     height: 127,
  //   }),
  // );
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

  const methods = await getServerMethods(createServerFrame(content, 'rpcServer'), output);

  let callPromise = methods.testInvoke();

  output?.('Calling remote method: .ping');

  const result = await callPromise;

  output?.(`Server response: ${result}`);
}

async function testCallback(content: HTMLElement, type?: string): Promise<void> {
  const output = createOutput({
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content, 'rpcServer'), output);

  output('Calling remote method: .testCallback');

  await new Promise<void>((resolve) => {
    methods.testCallbackArg('foo', (event) => {
      output(`Received event: ${event.type}, data: ${event.data}`);
      resolve();
    });
  });
}

async function testRaceCondition(content: HTMLElement): Promise<void> {
  const iframe = createServerFrame(content, 'rpcServer');

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

async function testNestedCallback(content: HTMLElement): Promise<void> {
  const output = createOutput({
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content, 'rpcServer'), output);

  output('Calling remote method: .testNestedCallback');

  await methods.testNestedCallback({
    type: 'foo',
    callback: (event) => {
      output(`Received event: ${event.type}, data: ${event.data}`);
    },
  });
}

async function testCallbackReturn(content: HTMLElement): Promise<void> {
  const output = createOutput({
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content, 'rpcServer'), output);

  output('Calling remote method: .testCallbackReturn');

  const callback = await methods.testCallbackReturn('foo');

  output('Calling server callback.');

  const result = await callback({
    data: 'bar',
  });

  output(`Received callback result: ${result}`);
}

async function testNestedReturn(content: HTMLElement): Promise<void> {
  const output = createOutput({
    container: createContainerFrame(content),
  });

  const methods = await getServerMethods(createServerFrame(content, 'rpcServer'), output);

  const result = await methods.testNestedReturn('foo');

  output(`Received nested return result: ${result.baz}`);

  output('Calling server callback.');

  const callbackResult = await result.callback({
    data: 'bar',
  });

  output(`Received callback result: ${callbackResult}`);

  try {
    // TODO: 这里的 result.element 应该是 never 类型
    result.element.style;
  } catch (error) {
    output('Access any property on a never type will throw an error.');
  }
}
