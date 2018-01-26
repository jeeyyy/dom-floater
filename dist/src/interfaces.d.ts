export declare namespace IFloater {
    enum Type {
        MODAL = "MODAL",
        POPUP = "POPUP",
        TOAST = "TOAST",
        SLIDEOUT = "SLIDEOUT",
    }
    enum ToastPosition {
        TOP = "TOP",
        RIGHT = "RIGHT",
        BOTTOM = "BOTTOM",
        LEFT = "LEFT",
        TOP_RIGHT = "TOP_RIGHT",
        TOP_LEFT = "TOP_LEFT",
        BOTTOM_LEFT = "BOTTOM_LEFT",
        BOTTOM_RIGHT = "BOTTOM_RIGHT",
    }
    enum PopupTriggerOn {
        CLICK = "CLICK",
        HOVER = "HOVER",
    }
    enum PopupPosition {
        TOP = "TOP",
        RIGHT = "RIGHT",
        BOTTOM = "BOTTOM",
        LEFT = "LEFT",
    }
    enum SlideOutPosition {
        TOP = "TOP",
        RIGHT = "RIGHT",
        BOTTOM = "BOTTOM",
        LEFT = "LEFT",
    }
    enum ContentElementType {
        NODE = "NODE",
        TEMPLATE = "TEMPLATE",
    }
    interface Configuration {
        type: Type;
        contentElement: Element | any;
        contentElementType: ContentElementType;
        modalMask?: boolean;
        expiry?: number;
        toastPosition?: ToastPosition;
        popupTargetElement?: HTMLElement;
        popupTriggerOn?: PopupTriggerOn;
        popupIsScrollableParentSelector?: string;
        slideOutTargetElement?: HTMLElement;
        slideOutPosition?: SlideOutPosition;
        slideOutMask?: boolean;
        guid?: string;
    }
    interface Component {
        show(configuration: IFloater.Configuration): Promise<void> | void;
        destroy(): Promise<void>;
        getGuid(): string;
        getConfiguration(): IFloater.Configuration;
        getContentElementWithSelector(selector: string): Element;
        getFloaterElementFromChild(contentChildElement: Element): Element;
    }
}
