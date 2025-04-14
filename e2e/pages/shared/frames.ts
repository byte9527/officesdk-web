import './frames.css';

/**
 * 创建一个 iframe 用于模拟服务端，
 * 并将对应的路径注入到 iframe 的 script 标签中
 */
export function createServerFrame(content: HTMLElement, chunk: string, iframe?: HTMLIFrameElement): HTMLIFrameElement {
  if (!iframe) {
    iframe = document.createElement('iframe');
  }

  iframe.src = '/template.html';

  iframe.classList.add('frame');

  content.appendChild(iframe);

  iframe.addEventListener('load', () => {
    // 将对应的路径注入到 iframe 的 script 标签中
    const script = document.createElement('script');
    script.src = `/${chunk}.bundle.js`;
    iframe.contentWindow?.document.body.appendChild(script);
  });

  return iframe;
}

export function createContainerFrame(content: HTMLElement): HTMLDivElement {
  const container = document.createElement('div');
  container.classList.add('frame');
  content.appendChild(container);

  return container;
}
