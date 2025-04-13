/**
 * Supported file types for the Office SDK.
 */
export enum FileType {
  Document = 0, // Document file, like .doc, .docx
  Spreadsheet = 1, // Spreadsheet file, like .xls, .xlsx
  Presentation = 2, // Presentation file, like .ppt, .pptx
  LiteDoc = 3, // Lite document.
  DBTable = 4, // Database table.
  Pdf = 5, // PDF file.
}

/**
 * 断言传入值是否为支持的文件类型
 */
export function assertFileType(input: unknown): void {
  if (typeof input !== 'number' || isNaN(input)) {
    // TODO: 抛出自定义错误
    throw new Error(`Unsupported file type: ${input}`);
  }

  const supportedFileTypes = [
    FileType.Document,
    FileType.Spreadsheet,
    FileType.Presentation,
    FileType.LiteDoc,
    FileType.DBTable,
    FileType.Pdf,
  ];

  if (!supportedFileTypes.includes(input)) {
    // TODO: 抛出自定义错误
    throw new Error(`Unsupported file type: ${input}`);
  }
}
