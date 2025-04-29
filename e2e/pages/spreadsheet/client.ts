import { createSDK, FileType } from '@officesdk/web';
import type { SpreadsheetFacade } from '@officesdk/web';
import type { OfficeSDK } from '@officesdk/web';

import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createOutput } from '../shared/output';

interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export function createClient(options: ClientOptions): OfficeSDK<FileType.Spreadsheet> {
  const { iframe, output } = options;

  output?.('Creating spreadsheet client...');

  const sdk = createSDK({
    endpoint: location.origin,
    token: '',
    fileId: '',
    iframe,
    fileType: FileType.Spreadsheet,
  });

  output?.('Client created, connecting...');

  return sdk;
}

export async function createEditor(content: HTMLElement): Promise<{
  editor: SpreadsheetFacade;
  output: (message: string) => void;
}> {
  const iframe = createServerFrame(content, 'spreadsheetServer');
  const container = createContainerFrame(content);
  const output = createOutput({
    container,
  });

  const sdk = createClient({
    output,
    iframe,
  });

  const editor = await sdk.connect();

  return {
    editor,
    output,
  };
}
