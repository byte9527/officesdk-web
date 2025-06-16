import type { SpreadsheetSDKOptions, EditorMenuCustomButton } from '../../shared';
import type { SheetToolbarOptions } from '@officesdk/editor-sdk-core/sheet';

export interface SpreadsheetSettings {
  /**
   * 自定义菜单
   */
  menu?: {
    custom?: EditorMenuCustomButton[];
  };
  /**
   * Toolbar related settings
   */
  toolbar?: {
    features?: SheetToolbarOptions['features'];
  };
}

export function createSpreadsheetOptions(settings?: SpreadsheetSettings): SpreadsheetSDKOptions | null {
  return {
    menu: settings?.menu,
    toolbar: settings?.toolbar,
  };
}
