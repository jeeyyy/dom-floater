import "./toaster-container.pcss";
export declare class ToasterContainer {
    private _hostElement;
    init(): void;
    add(toastElement: HTMLElement): void;
    destroy(): void;
}
export declare const toasterContainer: ToasterContainer;
