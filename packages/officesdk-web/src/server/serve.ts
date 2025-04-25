import { serve } from '@shimo/officesdk-rpc';
import type { Server } from '@shimo/officesdk-rpc';

import { createDocumentProxy } from './document';
import type { DocumentEditorFactory, DocumentContextFactory } from './document';
import { createSpreadsheetProxy } from './spreadsheet';
import type { SpreadsheetEditorFactory, SpreadsheetContextFactory } from './spreadsheet';
import { createPresentationProxy } from './presentation';
import type { PresentationEditorFactory, PresentationContextFactory } from './presentation';
import { createLiteDocProxy } from './ltdoc';
import type { LiteDocEditorFactory, LiteDocContextFactory } from './ltdoc';
import { createDatabaseTableProxy } from './dbtable';
import type { DatabaseTableEditorFactory, DatabaseTableContextFactory } from './dbtable';
import { createPdfProxy } from './pdf';
import type { PdfEditorFactory, PdfContextFactory } from './pdf';
import { FileType, assertFileType } from '../shared';

export interface ServeOptions<T extends FileType> {
  /**
   * 文件类型
   */
  fileType: T;

  /**
   * 编辑器实例
   */
  createEditor: EditorFactoryMap[T];

  /**
   * 编辑器上下文
   */
  createContext?: EditorContextFactoryMap[T];
}

type EditorContextFactoryMap = {
  [FileType.Document]: DocumentContextFactory;
  [FileType.Spreadsheet]: SpreadsheetContextFactory;
  [FileType.Presentation]: PresentationContextFactory;
  [FileType.LiteDoc]: LiteDocContextFactory;
  [FileType.DBTable]: DatabaseTableContextFactory;
  [FileType.Pdf]: PdfContextFactory;
};

type EditorFactoryMap = {
  [FileType.Document]: DocumentEditorFactory;
  [FileType.Spreadsheet]: SpreadsheetEditorFactory;
  [FileType.Presentation]: PresentationEditorFactory;
  [FileType.LiteDoc]: LiteDocEditorFactory;
  [FileType.DBTable]: DatabaseTableEditorFactory;
  [FileType.Pdf]: PdfEditorFactory;
};

function isDocumentOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.Document> {
  return options.fileType === FileType.Document;
}

function isSpreadsheetOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.Spreadsheet> {
  return options.fileType === FileType.Spreadsheet;
}

function isPresentationOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.Presentation> {
  return options.fileType === FileType.Presentation;
}

function isLiteDocOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.LiteDoc> {
  return options.fileType === FileType.LiteDoc;
}

function isDatabaseTableOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.DBTable> {
  return options.fileType === FileType.DBTable;
}

function isPdfOptions(options: ServeOptions<FileType>): options is ServeOptions<FileType.Pdf> {
  return options.fileType === FileType.Pdf;
}

export function serveSDK<T extends FileType>(options: ServeOptions<T>): Promise<Server> {
  const { fileType } = options;

  assertFileType(fileType);

  if (isDocumentOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createDocumentProxy(createEditor, createContext),
    });
  }

  if (isSpreadsheetOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createSpreadsheetProxy(createEditor, createContext),
    });
  }

  if (isPresentationOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createPresentationProxy(createEditor, createContext),
    });
  }

  if (isLiteDocOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createLiteDocProxy(createEditor, createContext),
    });
  }

  if (isDatabaseTableOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createDatabaseTableProxy(createEditor, createContext),
    });
  }

  if (isPdfOptions(options)) {
    const { createEditor, createContext } = options;
    return serve({
      proxy: createPdfProxy(createEditor, createContext),
    });
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}
