import { Token } from '@officesdk/rpc';

import type { DocumentZoom } from '../../shared';

export function proxyZoom(zoom: DocumentZoom) {
  return new Token(zoom);
}
