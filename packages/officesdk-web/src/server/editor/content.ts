import { Token } from '@officesdk/rpc';

import type { EditorContent } from '../../shared';

export function proxyContent(content: EditorContent) {
  return new Token(content);
}
