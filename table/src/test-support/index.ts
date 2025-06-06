import { assert } from '@ember/debug';
import { find, settled, triggerEvent } from '@ember/test-helpers';

interface Selectors {
  resizeHandle?: string;
  scrollContainer?: string;
}

export function createHelpers(selectors: Selectors) {
  async function resize(parent: Element, delta: number) {
    assert(
      `Can't use the dragLeft/dragRight/resize helpers without a \`resizeHandle\` selector`,
      selectors.resizeHandle,
    );

    const element = parent.querySelector(selectors.resizeHandle);

    assert(`Can't resize without a handle`, element);

    /**
     * Start the click in exactly the middle of the element.
     * "startX" is the horizontal middle of "element"
     */
    const rect = element.getBoundingClientRect();
    const startX = (rect.right + rect.left) / 2;

    const targetX = startX + delta;

    triggerEvent(element, 'mousedown', { clientX: startX, button: 0 });
    triggerEvent(element, 'mousemove', { clientX: targetX, button: 0 });
    triggerEvent(element, 'mouseup', { clientX: targetX, button: 0 });

    await settled();
  }

  function horizontalScrollElement() {
    assert(
      `Can't use scrollRight/swipeLeft helpers without a \`scrollContainer\` selector`,
      selectors.scrollContainer,
    );

    const element = find(selectors.scrollContainer);

    assert(`scroll container not found`, element instanceof HTMLElement);

    return element;
  }

  async function scrollRight(distance: number) {
    const element = horizontalScrollElement();

    element.scrollLeft += distance;
    await requestAnimationFrameSettled();
  }

  async function scrollLeft(distance: number) {
    const element = horizontalScrollElement();

    element.scrollLeft -= distance;
    await requestAnimationFrameSettled();
  }

  return {
    dragLeft: (column: Element, amount: number) => resize(column, -amount),
    dragRight: (column: Element, amount: number) => resize(column, amount),
    scrollLeft,
    scrollRight,
    swipeLeft: scrollRight,
    swipeRight: scrollLeft,
  };
}

export async function requestAnimationFrameSettled() {
  await new Promise(requestAnimationFrame);
  await settled();
}
