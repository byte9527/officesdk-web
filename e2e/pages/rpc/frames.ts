/**
 * 获取根元素
 * @returns 根元素
 */
function getRoot(): HTMLElement {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  return root;
}

/**
 * 创建一个 iframe 用于模拟服务端，
 * 并将对应的路径注入到 iframe 的 script 标签中
 */
export function createServerFrame(iframe?: HTMLIFrameElement): HTMLIFrameElement {
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.src = '/template.html';
  } else {
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  }

  iframe.classList.add('frame');

  const root = getRoot();

  root.appendChild(iframe);

  iframe.onload = () => {
    // 将对应的路径注入到 iframe 的 script 标签中
    const script = document.createElement('script');
    script.src = '/connection-server.bundle.js';
    iframe.contentWindow?.document.body.appendChild(script);
  };

  return iframe;
}

export function createClientFrame(): HTMLDivElement {
  const root = getRoot();

  const container = document.createElement('div');
  container.classList.add('frame');
  root.appendChild(container);

  return container;
}
