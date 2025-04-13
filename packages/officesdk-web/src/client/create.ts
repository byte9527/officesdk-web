import { create } from '@officesdk/rpc';
import type { RemoteProxy } from '@officesdk/rpc';

import { FileType, assertFileType } from '../shared';
import type { DocumentSDK } from '../shared';
import { createDocumentProxy, createDocumentFacade } from './document';
import { createDatabaseTableProxy, createDatabaseTableFacade } from './dbtable';
import { createLiteDocProxy, createLTDocFacade } from './ltdoc';
import { createPresentationProxy, createPresentationFacade } from './presentation';
import { createSpreadsheetProxy, createSpreadsheetFacade } from './spreadsheet';
import type { PdfSDK } from './pdf';
import { generateUrl } from './url';
import { createContainer, getContentWindow } from './container';

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
   * SDK 的文件类型
   */
  fileType: T;

  /**
   * 加载 SDK iframe 的根节点，这个是个可选配置，
   * 也可以在创建实例后将 sdk.iframe 加载到页面任意位置。
   */
  root?: HTMLElement;

  /**
   * 语言
   */
  lang?: 'zh-CN' | 'en-US';
}

type OfficeSDKMap = {
  [FileType.Document]: RemoteProxy<DocumentSDK>;
  [FileType.Spreadsheet]: RemoteProxy<SpreadsheetSDK>;
  [FileType.Presentation]: RemoteProxy<PresentationSDK>;
  [FileType.LiteDoc]: RemoteProxy<LiteDocSDK>;
  [FileType.DBTable]: RemoteProxy<DatabaseTableSDK>;
  [FileType.Pdf]: RemoteProxy<PdfSDK>;
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
  const { fileType, endpoint, token, fileId, root } = options;

  const url = generateUrl({ endpoint, token, fileId });

  const container = createContainer({ source: url.toString(), root });

  assertFileType(fileType);

  return {
    url: url.toString(),
    iframe: container.element,
    destroy: () => {
      container.element.remove();
    },
    connect: async (): Promise<OfficeSDKMap[T]> => {
      await container.promise;

      // Get the content window of the iframe,
      // which can use @officesdk/rpc create method.
      const remoteWindow = await getContentWindow(container.element);

      if (fileType === FileType.Document) {
        const client = await create({
          remoteWindow,
          proxy: createDocumentProxy(),
        });

        return createDocumentFacade(client);
      }

      // TODO: 支持其他文件类型
      throw new Error(`Unsupported file type: ${fileType}`);
    },
  };
}
