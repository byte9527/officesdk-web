import './output.css';
import { containsSelection } from './selection';

interface CreateOutputOptions {
  container: HTMLElement;
}

/**
 * Creates an output function that renders messages to a specified container
 */
export function createOutput(options: CreateOutputOptions): (message: string) => HTMLElement {
  const { container } = options;

  let tooltip: HTMLElement | null = null;

  // Listen for hover events on container through event bubbling
  // When hovering over content, display the full message in a tooltip
  // Hide the tooltip when mouse leaves
  container.addEventListener(
    'mouseover',
    (e) => {
      const { target } = e;

      if (!target || !(target instanceof HTMLElement)) {
        return;
      }

      if (!target.classList.contains('output-line-content')) {
        return;
      }

      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('output-tooltip');
        container.appendChild(tooltip);
      } else if (containsSelection(tooltip)) {
        return;
      }

      tooltip.textContent = target.textContent;

      const { left, top } = target.getBoundingClientRect();
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    },
    false,
  );

  container.addEventListener('mouseleave', () => {
    // Remove the tooltip when mouse leaves,
    // If the tooltip contains selection, do not remove it.
    if (!tooltip) {
      return;
    }

    if (!containsSelection(tooltip)) {
      container.removeChild(tooltip);
      tooltip = null;
    }
  });

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
