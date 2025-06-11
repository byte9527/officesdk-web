import type { Client, RPCReturnMapProxy } from '@officesdk/rpc';
import type { DatabaseTableMethods, DatabaseTableSheet, DatabaseTableSelection } from '../../shared';
import { createContentFacade } from '../editor/content';
import { createDBTableSelectionFacade } from './selection';

export interface DatabaseTableFacade {
  /**
   * Current activeDBSheet
   */
  readonly activeDBSheet: Promise<RPCReturnMapProxy<DatabaseTableSheet>>;

  /**
   * Current selection
   */
  readonly selection: RPCReturnMapProxy<DatabaseTableSelection>;

  /**
   * Get content
   */
  readonly content: ReturnType<typeof createContentFacade>;
}

export function createDatabaseTableFacade(client: Client<DatabaseTableMethods>): DatabaseTableFacade {
  const { methods } = client;

  const content = createContentFacade(methods);
  const selection = createDBTableSelectionFacade(methods);

  return {
    get activeDBSheet() {
      return methods.getActiveDBSheet();
    },
    get selection() {
      return selection;
    },
    get content() {
      return content;
    },
  };
}
