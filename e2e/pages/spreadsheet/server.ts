import { FileType } from '@shimo/officesdk-web';
import { serveSDK } from '@shimo/officesdk-web/server';

import { createOutput } from '../shared/output';
import { createRenderContent } from '../shared/renderer';
import { createContainerFrame } from '../shared/frames';
import { mockSpreadsheetEditor } from './mocks/editor';
import { mockEditorContent } from '../editor/mocks/content';

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  const renderContent = createRenderContent({ container: root });

  const content = renderContent();

  const output = createOutput({
    container: createContainerFrame(content),
  });

  output('Creating document server...');

  const server = await serveSDK({
    fileType: FileType.Spreadsheet,
    editor: mockSpreadsheetEditor(output),
    context: {
      content: mockEditorContent(output),
    },
  });

  output(
    server.getClientIds().length > 0
      ? `Server started, found clients: ${server.getClientIds().join(', ')}`
      : 'Server started, no clients found',
  );

  server.addClientListener((event, payload) => {
    if (event === 'add') {
      output(`Client ${payload.clientId} connected.`);
    } else if (event === 'delete') {
      output(`Client ${payload.clientId} disconnected.`);
    }
  });
}

main();
