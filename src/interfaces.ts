export namespace IFloater {
  export enum Type {
    MODAL = "MODAL",
    POPUP = "POPUP",
    TOAST = "TOAST",
    SLIDEOUT = "SLIDEOUT"
  }

  export enum ToastPosition {
    TOP = "TOP",
    RIGHT = "RIGHT",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    TOP_RIGHT = "TOP_RIGHT",
    TOP_LEFT = "TOP_LEFT",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    BOTTOM_RIGHT = "BOTTOM_RIGHT"
  }

  export enum SlideOutPosition {
    TOP = "TOP",
    RIGHT = "RIGHT",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT"
  }

  export enum ContentElementType {
    NODE = "NODE",
    TEMPLATE = "TEMPLATE"
  }

  export interface Configuration {
    type: Type;
    contentElement: Element | any;
    contentElementType: ContentElementType;
    // MODAL PROPS
    modalMask?: boolean;
    // TOAST PROPS
    expiry?: number; // milliseconds
    toastPosition?: ToastPosition;
    // POPUP PROPS
    popupTargetElement?: HTMLElement;
    popupMask?: boolean;
    // SLIDEOUT PROPS
    slideOutTargetElement?: HTMLElement;
    slideOutPosition?: SlideOutPosition;
    slideOutMask?: boolean;
    // INTERNAL PROPS
    guid?: string;
    createdTimeStamp?: number;
    enableMouseOutEvent?: boolean;
  }

  export interface Component {
    show(configuration: IFloater.Configuration): Promise<void> | void;
    destroy(): Promise<void>;
    getGuid(): string;
    getConfiguration(): IFloater.Configuration;
    getContentElementWithSelector(selector: string): Element;
    getFloaterElementFromChild(contentChildElement: Element): Element;
  }
}
