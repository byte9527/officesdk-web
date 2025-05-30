import { EditorModeType, EditorStandardRole } from '../shared';
import { UrlParamKey } from '../shared';

export interface UrlOptions {
  /**
   * 服务器地址， OFFICE SDK 部署的地址
   */
  endpoint: string;

  /**
   * 用于鉴权的 token
   * TODO: 添加过期时间
   * TODO: 后端补充对应注释
   */
  token: string;

  /**
   * 文件 ID
   */
  fileId: string;
  /**
   * 文件 类型
   */
  fileType: string;

  /**
   * 自定义页面路径
   */
  path?: string;

  /**
   * 语言
   */
  lang?: string;
  /**
   * 编辑器模式
   */
  mode?: EditorModeType;
  /**
   *  编辑器在 `standard` 模式下的权限模式
   */
  role?: EditorStandardRole;
  /**
   * 用户自定义参数
   */
  userQuery?: Record<string, string>
}

/**
 * 获取支持的语言，过滤掉不支持的语言，返回支持的语言。
 * @param lang
 * @returns
 */
function getLang(lang?: string): string | null {
  const supportedLangs = ['en-US', 'zh-CN'];

  if (!lang) {
    return null;
  }

  if (supportedLangs.includes(lang)) {
    return lang;
  }

  // TODO: warn 传入的语言不支持

  return null;
}

/**
 * 生成 Office SDK 的 URL
 * @param options
 * @returns
 */
export function generateUrl(options: UrlOptions): URL {
  const defaultPath = '/v1/api/file/page';
  const defaultMode = EditorModeType.Standard;
  const defaultRole = EditorStandardRole.Viewer;

  const { endpoint, token, fileId, fileType, userQuery, path = defaultPath, mode = defaultMode, role = defaultRole } = options;

  let url: URL;

  try {
    // Office SDK 的 URL 格式

    url = new URL(endpoint);
    // Check if the URL is valid
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      // TODO: 抛出自定义错误
      throw new Error('Invalid URL');
    }

    // TODO: path、params 支持配置
    url.pathname = path;

    url.searchParams.set(UrlParamKey.FileId, fileId);
    url.searchParams.set(UrlParamKey.Token, token);
    url.searchParams.set(UrlParamKey.FileType, fileType);
    url.searchParams.set(UrlParamKey.ModeType, mode);
    url.searchParams.set(UrlParamKey.ModeRole, role);

    const lang = getLang(options.lang);
    if (lang) {
      url.searchParams.set(UrlParamKey.Language, lang);
    }

    if (userQuery) {
     url.searchParams.set(UrlParamKey.UserQuery, encodeURIComponent(JSON.stringify(userQuery)));
    }
  } catch (error) {
    // TODO: 抛出自定义错误
    throw error;
  }

  return url;
}
