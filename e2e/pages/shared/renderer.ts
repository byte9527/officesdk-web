import './renderer.css';

interface RenderTitleOptions {
  container: HTMLElement;
}

/**
 * Create a function that renders a title to a container
 * @param options
 */
export function createRenderTitle(options: RenderTitleOptions): (title: string) => HTMLElement {
  const { container } = options;

  return (title: string): HTMLElement => {
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    titleElement.classList.add('title');
    container.appendChild(titleElement);

    return titleElement;
  };
}

interface CreateRenderContentOptions {
  container: HTMLElement;
}

interface RenderContentOptions {
  height?: number;
}

/**
 * Create a function that renders a content to a container
 * @param options
 */
export function createRenderContent(
  options: CreateRenderContentOptions,
): (options?: RenderContentOptions) => HTMLElement {
  const { container } = options;

  return ({ height }: RenderContentOptions = {}): HTMLElement => {
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');

    if (height) {
      contentElement.style.height = `${height}px`;
    }

    container.appendChild(contentElement);

    return contentElement;
  };
}
