import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';

import type { EditorOutlineMethods, EditorOutline, EditorOutlineItem } from '../../shared';

export function createOutlineFacade<Content>(
  methods: RPCReturnMethods<EditorOutlineMethods<Content>>,
): RPCReturnMapProxy<EditorOutline<Content>> {
  let outlineCache: Promise<RPCReturnMapProxy<EditorOutline<Content>>> | null = null;

  const getOutline = async (): Promise<RPCReturnMapProxy<EditorOutline<Content>>> => {
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
    addChangedListener: async (listener: (content: EditorOutlineItem<Content>[]) => void) => {
      const outline = await getOutline();
      return outline.addChangedListener(listener);
    },
    goto: async (id: string) => {
      const outline = await getOutline();
      return outline.goto(id);
    },
  };
}
