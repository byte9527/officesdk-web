import type { DatabaseTableSheet } from '../../shared';
import { createDatabaseTableSelectionProxy } from './selection';

export function createDatabaseTableSheetProxy(sheet: DatabaseTableSheet): DatabaseTableSheet {
  const { selection } = sheet;

  return {
    // id: sheet.id,
    // name: sheet.name,
    selection: selection ? createDatabaseTableSelectionProxy(selection) : null,
  };
}
