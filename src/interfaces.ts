export namespace IFloater {

    export enum Type {
        MODAL = 'MODAL',
        POPUP = 'POPUP',
        TOAST = 'TOAST'
    }

    export interface Dimensions {
        width: number;
        height: number;
    }


    export interface Configuration {
        type: Type,
        contentElement: HTMLElement | any;
        dimensions?: Dimensions;
    }


    export interface Component {
        // show functions
        // show(configuration: IFloaterConfiguration): Promise<void>;
        destroy(): Promise<void>;
        // init: (parentElement?: HTMLElement) => Promise<void>;
        // addListeners();
    }

    
}
