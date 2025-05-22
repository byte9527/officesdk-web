import { create } from '@officesdk/rpc';

import { FileType, assertFileType } from '../shared';
import { createDocumentProxy, createDocumentFacade, createDocumentOptions } from './document';
import type { DocumentFacade, DocumentSettings } from './document';
import { createDatabaseTableProxy, createDatabaseTableFacade } from './dbtable';
import type { DatabaseTableFacade } from './dbtable';
import { createLiteDocProxy, createLTDocFacade } from './ltdoc';
import type { LTDocFacade } from './ltdoc';
import { createPresentationProxy, createPresentationFacade, createPresentationOptions } from './presentation';
import type { PresentationFacade, PresentationSettings } from './presentation';
import { createSpreadsheetProxy, createSpreadsheetFacade, createSpreadsheetOptions } from './spreadsheet';
import type { SpreadsheetFacade, SpreadsheetSettings } from './spreadsheet';
import { createPdfProxy, createPdfFacade } from './pdf';
import type { PdfFacade } from './pdf';
import { generateUrl } from './url';
import { createContainer, connectContainer, getContentWindow } from './container';
import type { EditorModeType, EditorStandardRole } from '../shared';
import { mapToPreviewType } from '../shared/file';

export type SDKSettings = {
  [FileType.Document]: DocumentSettings;
  [FileType.Presentation]: PresentationSettings;
  [FileType.Spreadsheet]: SpreadsheetSettings;
};

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
   * 用户自定义参数
   */
  userQuery?: Record<string, string>

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

  /**
   * 初始化设置
   * TODO: settings 只有在没有传入 iframe 的时候才会生效，需要在类型上做区分
   */
  settings?: T extends keyof SDKSettings ? SDKSettings[T] : never;
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
  const { fileType, settings, ...others } = options;

  assertFileType(fileType);

  if (fileType === FileType.Document) {
    return createDocumentSDK({
      fileType,
      settings,
      ...others,
    }) as OfficeSDK<T>;
  }

  if (fileType === FileType.Spreadsheet) {
    return createSpreadsheetSDK({
      fileType,
      settings,
      ...others,
    }) as OfficeSDK<T>;
  }

  if (fileType === FileType.Presentation) {
    return createPresentationSDK({
      fileType,
      settings,
      ...others,
    }) as OfficeSDK<T>;
  }

  if (fileType === FileType.Pdf) {
    return createPdfSDK({
      fileType,
      ...others,
    }) as OfficeSDK<T>;
  }

  if (fileType === FileType.LiteDoc) {
    return createLiteDocSDK({
      fileType,
      ...others,
    }) as OfficeSDK<T>;
  }

  if (fileType === FileType.DBTable) {
    return createDatabaseTableSDK({
      fileType,
      ...others,
    }) as OfficeSDK<T>;
  }

  // Just for type check
  throw new Error(`Unsupported file type: ${fileType}`);
}

function connectIframe(options: CreateOptions<any>): { url: string; container: HTMLIFrameElement } {
  const { fileType, endpoint, token, fileId, path, root,mode, role, lang, iframe, userQuery} = options;

  let url: URL;
  let container: HTMLIFrameElement;

  if (iframe) {
    url = new URL(iframe.src);
    container = connectContainer({ iframe, root });
  } else {
    url = generateUrl({ endpoint, token, fileId, path, mode, role, lang, userQuery, fileType: mapToPreviewType(fileType) });
    container = createContainer({ source: url.toString(), root });
  }

  return {
    url: url.toString(),
    container,
  };
}

function createDocumentSDK(options: CreateOptions<FileType.Document>): OfficeSDK<FileType.Document> {
  const { settings } = options;

  const initOptions = createDocumentOptions(settings);

  const { url, container } = connectIframe(options);

  return {
    url: url,
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      // Get the content window of the iframe,
      // which can use @officesdk/rpc create method.
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createDocumentProxy(),
        settings: initOptions,
      });

      return createDocumentFacade(client);
    },
  };
}

function createSpreadsheetSDK(options: CreateOptions<FileType.Spreadsheet>): OfficeSDK<FileType.Spreadsheet> {
   const { settings } = options;
  const initOptions = createSpreadsheetOptions(settings);

  const { url, container } = connectIframe(options);

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createSpreadsheetProxy(),
        settings: initOptions,
      });

      return createSpreadsheetFacade(client);
    },
  };
}

function createPresentationSDK(options: CreateOptions<FileType.Presentation>): OfficeSDK<FileType.Presentation> {
  const { settings } = options;
  const initOptions = createPresentationOptions(settings);
  
  const { url, container } = connectIframe(options);

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createPresentationProxy(),
        settings: initOptions,
      });

      await client.methods.ready();
      
      return createPresentationFacade(client);
    },
  };
}

function createLiteDocSDK(options: CreateOptions<FileType.LiteDoc>): OfficeSDK<FileType.LiteDoc> {
  const { url, container } = connectIframe(options);

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createLiteDocProxy(),
      });

      return createLTDocFacade(client);
    },
  };
}

function createPdfSDK(options: CreateOptions<FileType.Pdf>): OfficeSDK<FileType.Pdf> {
  const { url, container } = connectIframe(options);

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createPdfProxy(),
      });

      return createPdfFacade(client);
    },
  };
}

function createDatabaseTableSDK(options: CreateOptions<FileType.DBTable>): OfficeSDK<FileType.DBTable> {
  const { url, container } = connectIframe(options);

  return {
    url: url.toString(),
    iframe: container,
    destroy: () => {
      container.remove();
    },
    connect: async () => {
      const remoteWindow = await getContentWindow(container);
      const client = await create({
        remoteWindow,
        proxy: createDatabaseTableProxy(),
      });

      // await client.methods.ready();

      return createDatabaseTableFacade(client);
    },
  };
}
