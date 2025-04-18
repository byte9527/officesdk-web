import { createSDK, FileType } from '@officesdk/web';
import type { PresentationFacade, OfficeSDK } from '@officesdk/web';

import { createContainerFrame, createServerFrame } from '../shared/frames';
import { createOutput } from '../shared/output';
interface ClientOptions {
  output?: (message: string) => void;
  iframe: HTMLIFrameElement;
}

export function createClient(options: ClientOptions): OfficeSDK<FileType.Presentation> {
  const { iframe, output } = options;

  output?.('Creating presentation client...');

  const sdk = createSDK({
    endpoint: location.origin,
    token: '',
    fileId: '',
    iframe,
    fileType: FileType.Presentation,
  });

  output?.('Client created, connecting...');

  return sdk;
}

export async function createEditor(content: HTMLElement): Promise<{
  editor: PresentationFacade;
  output: (message: string) => void;
}> {
  const iframe = createServerFrame(content, 'presentationServer');
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
