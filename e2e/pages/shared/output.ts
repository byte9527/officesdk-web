import './output.css';

interface CreateOutputOptions {
  container: HTMLElement;
}

/**
 * Creates an output function that renders messages to a specified container
 */
export function createOutput(options: CreateOutputOptions): (message: string) => HTMLElement {
  const { container } = options;

  return (message: string) => {
    const p = document.createElement('p');
    p.classList.add('output-line');

    const line = document.createElement('span');
    line.classList.add('output-line-content');
    line.textContent = message;

    p.appendChild(line);

    container.appendChild(p);

    return p;
  };
}
