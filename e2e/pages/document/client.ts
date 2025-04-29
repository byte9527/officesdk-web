import { createSDK, FileType } from '@officesdk/web';
import type { DocumentFacade, OfficeSDK } from '@officesdk/web';

import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createOutput } from '../shared/output';
interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export function createClient(options: ClientOptions): OfficeSDK<FileType.Document> {
  const { iframe, output } = options;

  output?.('Creating document client...');

  const sdk = createSDK({
    endpoint: location.origin,
    token: '',
    fileId: '',
    iframe,
    fileType: FileType.Document,
  });

  output?.('Client created, connecting...');

  return sdk;
}

export async function createEditor(content: HTMLElement): Promise<{
  editor: DocumentFacade;
  output: (message: string) => void;
}> {
  const iframe = createServerFrame(content, 'documentServer');
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
