import { serve } from '@officesdk/rpc';
import type { Server } from '@officesdk/rpc';

import { createDocumentProxy } from './document/proxy';
import { createSpreadsheetProxy } from './spreadsheet/proxy';
import { createPresentationProxy } from './presentation/proxy';
import { createLiteDocProxy } from './ltdoc/proxy';
import { createDatabaseTableProxy } from './dbtable/proxy';
import { createPdfProxy } from './pdf/proxy';

import { FileType, assertFileType } from '../shared';
import type {
  DocumentEditor,
  LiteDocEditor,
  PresentationEditor,
  SpreadsheetEditor,
  PdfEditor,
  DatabaseTableEditor,
} from '../shared';

export interface ServeOptions<T extends FileType> {
  /**
   * 文件类型
   */
  fileType: T;

  /**
   * 编辑器实例
   */
  editor: EditorMap[T];
}

type EditorMap = {
  [FileType.Document]: DocumentEditor;
  [FileType.Spreadsheet]: SpreadsheetEditor;
  [FileType.Presentation]: PresentationEditor;
  [FileType.LiteDoc]: LiteDocEditor;
  [FileType.DBTable]: DatabaseTableEditor;
  [FileType.Pdf]: PdfEditor;
};

function isDocumentEditor(editor: EditorMap[FileType], fileType: FileType): editor is DocumentEditor {
  return fileType === FileType.Document;
}

function isSpreadsheetEditor(editor: EditorMap[FileType], fileType: FileType): editor is SpreadsheetEditor {
  return fileType === FileType.Spreadsheet;
}

function isPresentationEditor(editor: EditorMap[FileType], fileType: FileType): editor is PresentationEditor {
  return fileType === FileType.Presentation;
}

function isLiteDocEditor(editor: EditorMap[FileType], fileType: FileType): editor is LiteDocEditor {
  return fileType === FileType.LiteDoc;
}

function isDatabaseTableEditor(editor: EditorMap[FileType], fileType: FileType): editor is DatabaseTableEditor {
  return fileType === FileType.DBTable;
}

function isPdfEditor(editor: EditorMap[FileType], fileType: FileType): editor is PdfEditor {
  return fileType === FileType.Pdf;
}

export function serveSDK<T extends FileType>(options: ServeOptions<T>): Promise<Server> {
  const { fileType, editor } = options;

  assertFileType(fileType);

  if (isDocumentEditor(editor, fileType)) {
    return serve({
      proxy: createDocumentProxy(editor),
    });
  }

  if (isSpreadsheetEditor(editor, fileType)) {
    return serve({
      proxy: createSpreadsheetProxy(editor),
    });
  }

  if (isPresentationEditor(editor, fileType)) {
    return serve({
      proxy: createPresentationProxy(editor),
    });
  }

  if (isLiteDocEditor(editor, fileType)) {
    return serve({
      proxy: createLiteDocProxy(editor),
    });
  }

  if (isDatabaseTableEditor(editor, fileType)) {
    return serve({
      proxy: createDatabaseTableProxy(editor),
    });
  }

  if (isPdfEditor(editor, fileType)) {
    return serve({
      proxy: createPdfProxy(editor),
    });
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}
