import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type { DocumentMethods, DocumentTOCs } from '../../shared';

export function createTOCsFacade(methods: RPCReturnMethods<DocumentMethods>): RPCReturnMapProxy<DocumentTOCs> {
  let TOCsCache: Promise<RPCReturnMapProxy<DocumentTOCs>> | null = null;

  const getTOCs = async (): Promise<RPCReturnMapProxy<DocumentTOCs>> => {
    if (TOCsCache) {
      return TOCsCache;
    }

    TOCsCache = methods.getTOCs();
    return TOCsCache;
  };

  return {
    getAll: async () => {
      const TOCs = await getTOCs();
      return TOCs.getAll();
    },
    getOne: async (index: number) => {
      const TOCs = await getTOCs();
      return TOCs.getOne(index);
    },
    deleteAll: async () => {
      const TOCs = await getTOCs();
      return TOCs.deleteAll();
    },
    deleteOne: async (index: number) => {
      const TOCs = await getTOCs();
      return TOCs.deleteOne(index);
    },
    add: async (options: { range?: string }) => {
      const TOCs = await getTOCs();
      return TOCs.add(options);
    },
  };
}
