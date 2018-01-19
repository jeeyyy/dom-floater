import { CONSTANTS } from "./constants";

export const getStyleToShowFloater = (x: number, y: number) => {
  return `left: ${x}px; top: ${y}px; visibility: visible; pointer-events: all; opacity: 1.0;`;
};

export const getStyleToHideFloater = () => {
  return `left: -9999px; top: -9999px; opacity: 0; visibility: hidden; pointer-events: none;`;
};

export const isElementScrollable = (
  element: HTMLElement
): {
  x: boolean;
  y: boolean;
} => {
  element = element[0] ? element[0] : element;
  const stylesToCheck = ["visible", "hidden"];
  return {
    y:
      element.scrollHeight > element.offsetHeight &&
      (stylesToCheck.indexOf(
        getComputedStyle(element, null).getPropertyValue("overflow")
      ) < 0 ||
        stylesToCheck.indexOf(
          getComputedStyle(element, null).getPropertyValue("overflow-y")
        ) < 0),
    x:
      element.scrollWidth > element.offsetWidth &&
      (stylesToCheck.indexOf(
        getComputedStyle(element, null).getPropertyValue("overflow")
      ) < 0 ||
        stylesToCheck.indexOf(
          getComputedStyle(element, null).getPropertyValue("overflow-x")
        ) < 0)
  };
};

export const isInView = (
  element: HTMLElement,
  containerElement?: HTMLElement
): {
  isInView: boolean;
  elementRect: ClientRect;
  containerRect: ClientRect;
} => {
  containerElement = containerElement ? containerElement : document.body;
  if (!containerElement) {
    throw new Error(CONSTANTS.MESSAGES.ERROR_NO_DOCUMENT_BODY);
  }
  const containerElementRect = containerElement.getBoundingClientRect() as ClientRect;
  const elementRect = element.getBoundingClientRect() as ClientRect;
  let isVerticallyInBounds =
    elementRect.top >= containerElementRect.top &&
    elementRect.bottom <= containerElementRect.bottom;
  let isHorizontallyInBounds =
    elementRect.left >= containerElementRect.left &&
    elementRect.right <= containerElementRect.right;
  if (isVerticallyInBounds && isHorizontallyInBounds) {
    return {
      isInView: true,
      elementRect: elementRect,
      containerRect: containerElementRect
    };
  } else {
    return {
      isInView: false,
      elementRect: elementRect,
      containerRect: containerElementRect
    };
  }
};
