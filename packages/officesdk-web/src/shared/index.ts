export { FileType, assertFileType } from './file';
export { EditorModeType, EditorStandardRole } from './editor';

export type {
  EditorContent,
  EditorContentRecord,
  EditorContentMethods,
  EditorOutline,
  EditorOutlineItem,
  EditorOutlineMethods,
  EditorMenuCustomButton,
  EditorMenuEntryButton,
  EditorMenuEntryConfig,
  EditorMenuFeatureButton,
  EditorMenuFeatureButtonConfig,
  EditorMenuOptions,
} from './editor';

export type {
  DocumentMethods,
  DocumentEditor,
  DocumentRange,
  DocumentRangeValue,
  DocumentRangeBounding,
  DocumentSelection,
  DocumentZoom,
  DocumentTOCs,
  DocumentTocItem,
  DocumentTocContentItem,
  DocumentOutline,
  DocumentOutlineItem,
  DocumentMenuEntryConfig,
  DocumentMenuFeatureButtonConfig,
  DocumentMenuFeatureButtonName,
  DocumentMenuOptions,
  DocumentSDKOptions,
} from './document';

export type {
  DocxWindowScrollParams as DocumentWindowScrollParams,
  DocxWindow as DocumentWindow,
} from '@officesdk/editor-sdk-core/docx';

export type {
  DatabaseTableMethods,
  DatabaseTableEditor,
  DatabaseTableSDKOptions,
  DatabaseTableSelection,
  DatabaseTableSheet,
  DatabaseTableSelectionType,
  DatabaseTableSelectionValue,
} from './dbtable';
export type { LiteDocMethods, LiteDocEditor, LiteDocSDKOptions } from './ltdoc';
export type {
  PresentationMethods,
  PresentationEditor,
  PresentationSelection,
  PresentationTextRange,
  PresentationTextRangeValue,
  PresentationShape,
  PresentationZoom,
  PresentationSlide,
  PresentationSlides,
  PresentationSDKOptions,
  PresentationMenuFeatureButtonName,
  PresentationMenuEntryConfig,
  PresentationMenuFeatureButtonConfig,
  PresentationMenuOptions,
} from './presentation';
export type {
  SpreadsheetMethods,
  SpreadsheetEditor,
  SpreadsheetCell,
  SpreadsheetCellValue,
  SpreadsheetRange,
  SpreadsheetRangeType,
  SpreadsheetRangeValue,
  SpreadsheetWorkbook,
  SpreadsheetSelection,
  SpreadsheetWorksheet,
  SpreadsheetSDKOptions,
  SpreadsheetMenuFeatureButtonName,
  SpreadsheetMenuEntryConfig,
  SpreadsheetMenuFeatureButtonConfig,
  SpreadsheetMenuOptions,
} from './spreadsheet';
export type {
  PdfMethods,
  PdfEditor,
  PdfPage,
  PdfPages,
  PdfSelection,
  PdfRange,
  PdfRangeValue,
  PdfRangeBounding,
  PdfOutline,
  PdfOutlineItem,
  PdfSDKOptions,
} from './pdf';
export { UrlParamKey } from './url';
