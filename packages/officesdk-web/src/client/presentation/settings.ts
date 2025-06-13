import type { PresentationSDKOptions, EditorMenuCustomButton } from '../../shared';
import type { PresentationToolbarOptions } from '@officesdk/editor-sdk-core/presentation'

export interface PresentationSettings {
  /**
   * 自定义菜单
   */
  menu?: {
    custom?: EditorMenuCustomButton[];
  };
  toolbar?: {
    features?: PresentationToolbarOptions['features']
  }
}

export function createPresentationOptions(settings?: PresentationSettings): PresentationSDKOptions | null {

  return {
    menu: settings?.menu,
    toolbar: settings?.toolbar
  };
}
