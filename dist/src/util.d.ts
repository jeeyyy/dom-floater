export declare const getStyleToShowFloater: (x: number, y: number) => string;
export declare const getStyleToHideFloater: () => string;
export declare const isElementScrollable: (element: HTMLElement) => {
    x: boolean;
    y: boolean;
};
export declare const isInView: (element: HTMLElement, containerElement?: HTMLElement) => {
    isInView: boolean;
    elementRect: ClientRect;
    containerRect: ClientRect;
};
