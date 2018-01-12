import './toaster-container.pcss';
export declare class ToasterContainer {
    private _hostElement;
    constructor();
    init(): void;
    add(toastElement: HTMLElement): void;
    destroy(): void;
}
export declare const toasterContainer: ToasterContainer;
