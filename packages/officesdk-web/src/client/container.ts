export interface CreateContainerOptions {
  /**
   * 容器 iframe 的源地址
   */
  source: string;

  /**
   * 挂载容器 iframe 的根节点
   */
  root?: HTMLElement;
}

export interface Container {
  /**
   * 容器 iframe 的实例
   */
  iframe: HTMLIFrameElement;
}

/**
 * 创建一个 iframe 容器，用于加载 Office SDK 的页面，
 * 页面内需要提供可供 Office SDK 通信和远程调用的 rpc 接口，
 * @param options
 */
export function createContainer(options: CreateContainerOptions): HTMLIFrameElement {
  const { source, root } = options;

  const iframe = document.createElement('iframe');

  iframe.src = source;

  return connectContainer({ iframe, root });
}

export interface ConnectContainerOptions {
  /**
   * 容器 iframe 的实例
   */
  iframe: HTMLIFrameElement;

  /**
   * 挂载容器 iframe 的根节点
   */
  root?: HTMLElement;
}

export function connectContainer(options: ConnectContainerOptions): HTMLIFrameElement {
  const { iframe, root } = options;

  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.frameBorder = '0';
  iframe.allow = 'fullscreen *; clipboard-read *; clipboard-write *;';
  // TODO: 需要注意 fullscreen 相关能力在 safari 中不能使用，需要做降级处理
  iframe.allowFullscreen = true;

  root?.appendChild(iframe);

  return iframe;
}

export async function getContentWindow(iframe: HTMLIFrameElement): Promise<Window> {
  const contentWindow = iframe.contentWindow;

  if (contentWindow) {
    return contentWindow;
  } else {
    return await new Promise((resolve, reject) => {
      const loadListener = () => {
        iframe.removeEventListener('load', loadListener);
        iframe.removeEventListener('error', errorListener);

        const contentWindow = iframe.contentWindow;
        if (contentWindow) {
          resolve(contentWindow);
        } else {
          // TODO: Error handling
          reject(new Error('Failed to load iframe'));
        }
      };

      const errorListener = () => {
        iframe.removeEventListener('load', loadListener);
        iframe.removeEventListener('error', errorListener);

        // TODO: Error handling
        reject(new Error('Failed to load iframe'));
      };

      iframe.addEventListener('load', loadListener);
      iframe.addEventListener('error', errorListener);
    });
  }
}
