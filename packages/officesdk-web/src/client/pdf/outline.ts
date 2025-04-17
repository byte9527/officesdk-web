import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';

import type { PdfMethods, EditorOutline, EditorOutlineItem } from '../../shared';

export function createOutlineFacade(methods: RPCReturnMethods<PdfMethods>): RPCReturnMapProxy<EditorOutline> {
  let outlineCache: Promise<RPCReturnMapProxy<EditorOutline>> | null = null;

  const getOutline = async (): Promise<RPCReturnMapProxy<EditorOutline>> => {
    if (outlineCache) {
      return outlineCache;
    }

    outlineCache = methods.getOutline();
    return outlineCache;
  };

  return {
    getContent: async () => {
      const outline = await getOutline();
      return outline.getContent();
    },
    addChangedListener: async (listener: (content: EditorOutlineItem[]) => void) => {
      const outline = await getOutline();
      return outline.addChangedListener(listener);
    },
    goto: async (id: string) => {
      const outline = await getOutline();
      return outline.goto(id);
    },
  };
}
