export namespace IFloater {

    export enum Event {
        CLOSED = 'CLOSED'
    }

    export enum Type {
        MODAL = 'MODAL',
        POPUP = 'POPUP',
        TOAST = 'TOAST'
    }

    export interface Dimensions {
        width: number;
        height: number;
    }

    export interface BaseElement {

    }

    export interface Configuration {
        type: Type,
        contentElement: HTMLElement | any;
        dimensions?: Dimensions;
        // internally extended properties
        guid?: string;
    }


    export interface Component {
        // show functions
        // show(configuration: IFloaterConfiguration): Promise<void>;
        destroy(): Promise<void>;
        // init: (parentElement?: HTMLElement) => Promise<void>;
        // addListeners();
    }


}
