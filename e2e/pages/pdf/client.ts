import { createSDK, FileType } from '@shimo/officesdk-web';
import type { PdfFacade, OfficeSDK } from '@shimo/officesdk-web';

import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createOutput } from '../shared/output';
interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export function createClient(options: ClientOptions): OfficeSDK<FileType.Pdf> {
  const { iframe, output } = options;

  output?.('Creating pdf client...');

  const sdk = createSDK({
    endpoint: location.origin,
    token: '',
    fileId: '',
    iframe,
    fileType: FileType.Pdf,
  });

  output?.('Client created, connecting...');

  return sdk;
}

export async function createEditor(content: HTMLElement): Promise<{
  editor: PdfFacade;
  output: (message: string) => void;
}> {
  const iframe = createServerFrame(content, 'pdfServer');
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
