import { create } from '@shimo/officesdk-rpc';

import { FileType, assertFileType } from '../shared';
import { createDocumentProxy, createDocumentFacade } from './document';
import type { DocumentFacade } from './document';
import { createDatabaseTableProxy, createDatabaseTableFacade } from './dbtable';
import type { DatabaseTableFacade } from './dbtable';
import { createLiteDocProxy, createLTDocFacade } from './ltdoc';
import type { LTDocFacade } from './ltdoc';
import { createPresentationProxy, createPresentationFacade } from './presentation';
import type { PresentationFacade } from './presentation';
import { createSpreadsheetProxy, createSpreadsheetFacade } from './spreadsheet';
import type { SpreadsheetFacade } from './spreadsheet';
import { createPdfProxy, createPdfFacade } from './pdf';
import type { PdfFacade } from './pdf';
import { generateUrl } from './url';
import { createContainer, connectContainer, getContentWindow } from './container';
import type { EditorModeType, EditorStandardRole } from '../shared';
import { mapToPreviewType } from '../shared/file';
/**
 * 初始化 Office SDK 的配置项，
 * 需要传入 endpoint、 token、 fileId 用于连接服务端并鉴权，
 * 以及指定 fileType 用于初始化 SDK 操作接口。
 */
export interface CreateOptions<T extends FileType> {
  /**
   * 连接的 endpoint
   */
  endpoint: string;

  /**
   * 鉴权 token
   */
  token: string;

  /**
   * 文件 ID
   */
  fileId: string;

  /**
   * 自定义页面路径
   */
  path?: string;

  /**
   * SDK 的文件类型
   */
  fileType: T;

  /**
   * 加载 SDK iframe 的根节点，这个是个可选配置，
   * 也可以在创建实例后再将 sdk.iframe 加载到页面任意位置。
   */
  root?: HTMLElement;

  /**
   * 已加载 SDK 环境的 iframe 实例
   */
  iframe?: HTMLIFrameElement;

  /**
   * 语言
   */
  lang?: 'zh-CN' | 'en-US';
    /**
   * 编辑器模式
   */
  mode?: EditorModeType;
  /**
   *  编辑器在 `standard` 模式下的权限模式
   */
  role?: EditorStandardRole;
}

export type OfficeSDKMap = {
  [FileType.Document]: DocumentFacade;
  [FileType.Spreadsheet]: SpreadsheetFacade;
  [FileType.Presentation]: PresentationFacade;
  [FileType.LiteDoc]: LTDocFacade;
  [FileType.DBTable]: DatabaseTableFacade;
  [FileType.Pdf]: PdfFacade;
};

/**
 * Office SDK 实例对象，调用 connect 方法初始化后返回的可操作对象。
 * 实例内封装了一些常用的属性和函数供开发者使用。
 */
export interface OfficeSDK<T extends FileType> {
  /**
   * 连接 Office SDK，
   * 连接成功返回 Office SDK 实例，
   * 如果失败会抛出对应错误。
   * @returns 返回 Office SDK 实例
   */
  connect: () => Promise<OfficeSDKMap[T]>;

  /**
   * 当前 SDK iframe 加载的 URL
   */
  readonly url: string;

  /**
   * 当前 SDK iframe 的实例
   */
  readonly iframe: HTMLIFrameElement;

  /**
   * 销毁当前 SDK 实例
   */
  destroy(): void;
}

/**
 * 创建 Office SDK 实例
 */
export function createSDK<T extends FileType>(options: CreateOptions<T>): OfficeSDK<T> {
  const { fileType, endpoint, token, fileId, path, root, iframe, mode, role } = options;

  assertFileType(fileType);

  let url: URL;
  let container: HTMLIFrameElement;

  if (iframe) {
    url = new URL(iframe.src);
    container = connectContainer({ iframe, root });
  } else {
    url = generateUrl({ endpoint, token, fileId, path, mode, role, fileType: mapToPreviewType(fileType) });
    container = createContainer({ source: url.toString(), root });
  }

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async (): Promise<OfficeSDKMap[T]> => {
      // Get the content window of the iframe,
      // which can use @shimo/officesdk-rpc create method.
      const remoteWindow = await getContentWindow(container);

      if (fileType === FileType.Document) {
        const client = await create({
          remoteWindow,
          proxy: createDocumentProxy(),
        });

        // 因为 fileType 的判断在 connect 函数内进行的判断，所以类型无法进行准确的推断，这里直接 as 一下即可
        return createDocumentFacade(client) as OfficeSDKMap[T];
      }

      if (fileType === FileType.Spreadsheet) {
        const client = await create({
          remoteWindow,
          proxy: createSpreadsheetProxy(),
        });

        return createSpreadsheetFacade(client) as OfficeSDKMap[T];
      }

      if (fileType === FileType.Presentation) {
        const client = await create({
          remoteWindow,
          proxy: createPresentationProxy(),
        });

        return createPresentationFacade(client) as OfficeSDKMap[T];
      }

      if (fileType === FileType.Pdf) {
        const client = await create({
          remoteWindow,
          proxy: createPdfProxy(),
        });

        return createPdfFacade(client) as OfficeSDKMap[T];
      }

      if (fileType === FileType.LiteDoc) {
        const client = await create({
          remoteWindow,
          proxy: createLiteDocProxy(),
        });

        return createLTDocFacade(client) as OfficeSDKMap[T];
      }

      if (fileType === FileType.DBTable) {
        const client = await create({
          remoteWindow,
          proxy: createDatabaseTableProxy(),
        });

        return createDatabaseTableFacade(client) as OfficeSDKMap[T];
      }

      throw new Error(`Unsupported file type: ${fileType}`);
    },
  };
}
