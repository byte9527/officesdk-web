/**
 * Check if the selection is inside the element
 * @param element - The element to check
 * @returns true if the selection is inside the element, false otherwise
 */
export function containsSelection(element: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection) {
    return false;
  }

  return element.contains(selection.anchorNode);
}
