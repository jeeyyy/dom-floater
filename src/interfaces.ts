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

    export enum PopupTriggerOn {
        CLICK = 'CLICK',
        HOVER = 'HOVER'
    }

    export interface Configuration {
        type: Type,
        contentElement: Element | any;
        // TOAST Properties
        expiry?: number; // milliseconds
        // POPUP PROPERTIES
        popupTargetElement?: HTMLElement;
        popupPosition?: PopupPosition;
        popupTriggerOn?: PopupTriggerOn;
        popupIsScrollableParentSelector?: string;
        // INTERNAL PROPERTIES
        guid?: string;
    }


    export interface Component {
        show(configuration: IFloater.Configuration): Promise<void> | void;
        destroy(): Promise<void>;
        getContentElementWithSelector(selector: string): Element;
        getFloaterElementFromChild(contentChildElement: Element): Element;
    }

}
