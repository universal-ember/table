/**
  We want to make sure we get the clientWidth rather than the
  offsetWidth so that the width of the scrollbar is not included when we're
  resizing the columns in the table so that they fit within the scroll
  container

  Ideally we would just use `entry.contentRect.width`, which we can access
  without triggering any reflows. Unfortunately there are differences in the
  way that this works in Chrome vs Firefox. In Chrome, the
  `entry.contentRect.width` works the same as `entry.target.clientWidth`,
  which does not include the width that is taken up by the vertical scrollbar
  if the element overflows. In Firefox the `entry.contentRect.width` is the
  same as `entry.target.offsetWidth`, which does include the width taken up by
  the scrollbar.

  We use `getBoundingClientRect()` because it does not round the value to an
  integer, which can sometimes cause subpixel gaps.
**/
export const getAccurateClientWidth = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  const padding =
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const scrollbarWidth = element.offsetWidth - element.clientWidth;

  return element.getBoundingClientRect().width - padding - scrollbarWidth;
};

export const totalGapOf = (element?: Element | null) => {
  if (!element) return 0;

  const style = getComputedStyle(element);
  const gapSize = parseFloat(style.columnGap);
  const cells = element.querySelectorAll(
    '[role="cell"], [role="columnheader"]',
  );

  let totalCellPadding = 0;

  for (const cell of cells) {
    const style = getComputedStyle(cell);
    const padding =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

    totalCellPadding += padding;
  }

  return gapSize * (element.children.length - 1) + totalCellPadding;
};

export const getAccurateClientHeight = (element: HTMLElement) => {
  const scrollbarHeight = element.offsetHeight - element.clientHeight;

  return element.getBoundingClientRect().height - scrollbarHeight;
};
