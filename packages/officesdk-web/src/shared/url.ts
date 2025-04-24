export enum UrlParamKey {
  WithInitOptions = 'wio',
  FileId = 'file_id',
  Token = 'token',
  Language = 'lang',
}

export function hasInitOptions(url: URL): boolean {
  return url.searchParams.has(UrlParamKey.WithInitOptions);
}
