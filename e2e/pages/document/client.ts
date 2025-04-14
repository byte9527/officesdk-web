import { createSDK, FileType } from '@officesdk/web';
import type { OfficeSDK } from '@officesdk/web';

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
