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
    interface Dimensions {
        width: number;
        height: number;
    }
    interface Configuration {
        type: Type;
        contentElement: Element | any;
        expiry?: number;
        dimensions?: Dimensions;
        popupTargetElement?: Element;
        popupPosition?: PopupPosition;
        guid?: string;
    }
    interface Component {
        destroy(): Promise<void>;
    }
}
