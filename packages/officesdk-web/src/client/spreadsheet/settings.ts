import type { SpreadsheetSDKOptions, EditorMenuCustomButton } from '../../shared';

export interface SpreadsheetSettings {
  /**
   * 自定义菜单
   */
  menu?: {
    custom?: EditorMenuCustomButton[];
  };
}

export function createSpreadsheetOptions(settings?: SpreadsheetSettings): SpreadsheetSDKOptions | null {
  // 如果没有有效的初始化设置，直接返回 null
  if (!settings?.menu?.custom?.length) {
    return null;
  }

  return {
    menu: settings.menu,
  };
}