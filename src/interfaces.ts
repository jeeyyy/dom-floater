export namespace IFloater {

    export enum Type {
        MODAL = 'MODAL',
        POPUP = 'POPUP',
        TOAST = 'TOAST'
    }

    export enum PopupPosition {
        TOP = 'TOP',
        BOTTOM = 'BOTTOM',
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
        AUTO = 'AUTO'
    }

    export interface Dimensions {
        width: number;
        height: number;
    }

    export interface Configuration {
        type: Type,
        contentElement: Element | any;

        // OPTIONAL PROPERTIES - common to any type
        expiry?: number; // milliseconds
        dimensions?: Dimensions;

        // POPUP PROPERTIES
        popupTargetElement?: Element;
        popupPosition?: PopupPosition

        // INTERNAL PROPERTIES
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
