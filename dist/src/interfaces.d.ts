export declare namespace IFloater {
    enum Event {
        CLOSED = "CLOSED",
    }
    enum Type {
        MODAL = "MODAL",
        POPUP = "POPUP",
        TOAST = "TOAST",
    }
    interface Dimensions {
        width: number;
        height: number;
    }
    interface BaseElement {
    }
    interface Configuration {
        type: Type;
        contentElement: HTMLElement | any;
        dimensions?: Dimensions;
        guid?: string;
    }
    interface Component {
        destroy(): Promise<void>;
    }
}
