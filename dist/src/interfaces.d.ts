export declare namespace IFloater {
    enum Type {
        MODAL = "MODAL",
        POPUP = "POPUP",
        TOAST = "TOAST",
    }
    enum PopupPosition {
        TOP = "TOP",
        BOTTOM = "BOTTOM",
        LEFT = "LEFT",
        RIGHT = "RIGHT",
        AUTO = "AUTO",
    }
    enum PopupTriggerOn {
        CLICK = "CLICK",
        HOVER = "HOVER",
    }
    enum ContentElementType {
        NODE = "NODE",
        TEMPLATE = "TEMPLATE",
    }
    interface Configuration {
        type: Type;
        contentElement: Element | any;
        contentElementType: ContentElementType;
        expiry?: number;
        popupTargetElement?: HTMLElement;
        popupPosition?: PopupPosition;
        popupTriggerOn?: PopupTriggerOn;
        popupIsScrollableParentSelector?: string;
        guid?: string;
    }
    interface Component {
        show(configuration: IFloater.Configuration): Promise<void> | void;
        destroy(): Promise<void>;
        getGuid(): string;
        getContentElementWithSelector(selector: string): Element;
        getFloaterElementFromChild(contentChildElement: Element): Element;
    }
}
