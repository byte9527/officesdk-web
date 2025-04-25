export enum UrlParamKey {
  WithInitOptions = 'wio',
  FileId = 'fileId',
  Token = 'token',
  Language = 'lang',
  ModeType = 'modeType',
  FileType = 'fileType',
  ModeRole = 'modeRole',
}

export function hasInitOptions(url: URL): boolean {
  return url.searchParams.has(UrlParamKey.WithInitOptions);
}
