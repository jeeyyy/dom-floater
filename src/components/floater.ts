const nanoId = require("nanoid");
import "./floater.pcss";
import { CONSTANTS } from "./../constants";
import { IFloater } from "../interfaces";
import { floaterInstances } from "./floater-instances";
import { masker } from "./masker";
import { toasterContainer } from "./toaster-container";
import {
  isElementScrollable,
  isInView,
  getStyleToShowFloater,
  getStyleToHideFloater
} from "../util";

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {
  private _hostElement: HTMLElement;
  private _callbacks = {}; // dynamically constructed object
  private _dynamicRefs = {
    CONTENT_ELEMENT_WHEN_NODE_PROPS: {
      PARENT_REF: null,
      SIBLING_REF: null,
      IS_LAST_CHILD: null
    },
    POPUP_PROPS: {
      POPUP_MASK: null,
      POPUP_MASK_WHEEL_LISTENER: null,
      POPUP_MASK_WHEEL_CLICK_LISTENER: null
    }
  };
  private HELPER_FUNCTIONS = {
    getClassName: (config: IFloater.Configuration) => {
      let baseClass = `dom-floater-base ${config.type}`;
      switch (config.type) {
        case IFloater.Type.MODAL:
          return `${baseClass} ${config.modalMask ? config.modalMask : "MASK"}`;
        case IFloater.Type.TOAST:
          return `${baseClass} ${
            config.toastPosition ? config.toastPosition : ""
          }`;
        case IFloater.Type.POPUP:
          return `${baseClass}`;
        case IFloater.Type.SLIDEOUT:
          return `${baseClass} ${
            config.slideOutPosition ? config.slideOutPosition : ""
          } ${config.slideOutMask ? config.slideOutMask : "MASK"}`;
      }
    },
    getFloaterParentWithSelector: (
      startEl: HTMLElement,
      selector: string
    ): HTMLElement => {
      while (startEl.parentNode) {
        startEl = startEl.parentNode as HTMLElement;
        if (
          startEl &&
          startEl.classList &&
          startEl.classList.length &&
          startEl.classList.contains(selector)
        ) {
          return startEl;
        }
      }
      return null;
    },
    destructOnExpiry: (expiryDurtaion: number) => {
      let timer;
      return () => {
        clearTimeout(timer); // be sure to clear if object exists.
        timer = setTimeout(() => {
          this.destroy();
          clearTimeout(timer);
        }, expiryDurtaion);
      };
    },
    handlerForDestructOnEscape: (event: KeyboardEvent) => {
      if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
        this.destroy();
      }
    },
    handlerForDestructOnDocumentClick: (event: MouseEvent) => {
      const isChildElement = this.getFloaterElementFromChild(event.srcElement);
      if (isChildElement === null) {
        this.destroy();
      }
    },
    handlerForDestructOnPopupMaskClick: (event: MouseEvent) => {
      this.destroy();
    },
    destructOnPopupMask: (registerEvent: boolean) => {
      if (registerEvent) {
        this._dynamicRefs.POPUP_PROPS.POPUP_MASK_WHEEL_LISTENER = require("mouse-wheel")(
          this._dynamicRefs.POPUP_PROPS.POPUP_MASK,
          (dx, dy) => {
            this.destroy();
          }
        );
        this._dynamicRefs.POPUP_PROPS.POPUP_MASK.addEventListener(
          "click",
          this.HELPER_FUNCTIONS.handlerForDestructOnPopupMaskClick
        );
      } else {
        if (
          this._dynamicRefs &&
          this._dynamicRefs.POPUP_PROPS &&
          this._dynamicRefs.POPUP_PROPS.POPUP_MASK
        ) {
          if (this._dynamicRefs.POPUP_PROPS.POPUP_MASK_WHEEL_LISTENER) {
            this._dynamicRefs.POPUP_PROPS.POPUP_MASK.removeEventListener(
              "wheel",
              this._dynamicRefs.POPUP_PROPS.POPUP_MASK_WHEEL_LISTENER
            );
          }
          this._dynamicRefs.POPUP_PROPS.POPUP_MASK.removeEventListener(
            "click",
            this.HELPER_FUNCTIONS.handlerForDestructOnPopupMaskClick
          );
        }
      }
    },
    destructOnEscape: (registerEvent: boolean) => {
      if (registerEvent) {
        document.addEventListener(
          "keyup",
          this.HELPER_FUNCTIONS.handlerForDestructOnEscape
        );
      } else {
        document.removeEventListener(
          "keyup",
          this.HELPER_FUNCTIONS.handlerForDestructOnEscape
        );
      }
    },
    destructOnDocumentClick: (registerEvent: boolean) => {
      if (registerEvent) {
        document.addEventListener(
          "click",
          this.HELPER_FUNCTIONS.handlerForDestructOnDocumentClick
        );
      } else {
        document.removeEventListener(
          "click",
          this.HELPER_FUNCTIONS.handlerForDestructOnDocumentClick
        );
      }
    },
    handleShowModal: (getCurrentInstanceOfType: Floater[]) => {
      // only init a mask element if this is the first modal that is shown
      if (
        getCurrentInstanceOfType &&
        getCurrentInstanceOfType.length <= 1 &&
        this.configuration.modalMask
      ) {
        masker.init();
      }
      // create Modal
      document.body.appendChild(this._hostElement);
      this.HELPER_FUNCTIONS.handleShow();
    },
    handleShowToast: (getCurrentInstanceOfType: Floater[]) => {
      // only init a toast container element if does not exist
      if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
        toasterContainer.init();
      }
      toasterContainer.add(this._hostElement);
      // if has expiry - start destruction timer
      if (this.configuration.expiry) {
        this.HELPER_FUNCTIONS.destructOnExpiry(this.configuration.expiry)();
      }
      this.HELPER_FUNCTIONS.handleShow();
    },
    handleShowPopup: (getCurrentInstanceOfType: Floater[]) => {
      if (this.configuration.popupMask) {
        this._dynamicRefs.POPUP_PROPS.POPUP_MASK = document.createElement(
          "NAV"
        );
        this._dynamicRefs.POPUP_PROPS.POPUP_MASK.className = "popup-mask";
        this._hostElement.appendChild(this._dynamicRefs.POPUP_PROPS.POPUP_MASK);
      }
      if (this.configuration.popupTargetElement) {
        document.body.appendChild(this._hostElement);
        this.HELPER_FUNCTIONS.positionPopup();
      } else {
        throw new Error(
          CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_POPUP_TARGET
        );
      }
      // and delete the previous one
      if (getCurrentInstanceOfType && getCurrentInstanceOfType.length > 0) {
        // dispose old one
        getCurrentInstanceOfType.forEach((instance: Floater) => {
          if (instance.configuration.guid !== this.configuration.guid) {
            instance.destroy();
          }
        });
      }
      this.HELPER_FUNCTIONS.handleShow();
    },
    handleShowSlideOut: (getCurrentInstanceOfType: Floater[]) => {
      if (this.configuration.slideOutTargetElement) {
        this.configuration.slideOutTargetElement.insertBefore(
          this._hostElement,
          this.configuration.slideOutTargetElement.firstChild
        );
      } else {
        throw new Error(
          CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_SLIDEOUT_TARGET
        );
      }
      this.HELPER_FUNCTIONS.handleShow();
    },
    handleShow: () => {
      return new Promise((resolve, reject) => {
        requestAnimationFrame(() => {
          // the time out waits for the css kicks in.
          this._hostElement.dataset[`isInitialising`] = `false`;
        });
        requestAnimationFrame(() => {
          if (this.configuration.type === IFloater.Type.POPUP) {
            this.HELPER_FUNCTIONS.destructOnEscape(true); // TODO: Make this a property
            if (this.configuration.popupMask) {
              this.HELPER_FUNCTIONS.destructOnPopupMask(true);
            } else {
              this.HELPER_FUNCTIONS.destructOnDocumentClick(true);
            }
          }
          resolve();
        });
      });
    },
    positionPopup: () => {
      // there is no parent that can scroll, so position next to target element & do not watch to update on viewport changes.
      const targetElRect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
      const popUpElRect: ClientRect = this._hostElement.getBoundingClientRect();
      const attempts = [
        "rightTop",
        "rightBottom",
        "topLeft",
        "topRight",
        "leftTop",
        "leftBottom",
        "bottomLeft",
        "bottomRight"
      ];
      const popupHeight = popUpElRect.bottom - popUpElRect.top;
      const popupWidth = popUpElRect.right - popUpElRect.left;
      const attemptMath = {
        rightTop: {
          x: targetElRect.right,
          y: targetElRect.top
        },
        rightBottom: {
          x: targetElRect.right,
          y: targetElRect.bottom - popupHeight
        },
        topLeft: {
          x: targetElRect.left,
          y: targetElRect.top - popupHeight
        },
        topRight: {
          x: targetElRect.right - popupWidth,
          y: targetElRect.top - popupHeight
        },
        leftTop: {
          x: targetElRect.left - popupWidth,
          y: targetElRect.top
        },
        leftBottom: {
          x: targetElRect.left - popupWidth,
          y: targetElRect.bottom - popupHeight
        },
        bottomLeft: {
          x: targetElRect.left,
          y: targetElRect.bottom
        },
        bottomRight: {
          x: targetElRect.right - popupWidth,
          y: targetElRect.bottom
        }
      };
      for (let index in attempts) {
        const direction = attempts[index];
        this._hostElement.setAttribute(
          "style",
          getStyleToShowFloater(
            attemptMath[direction].x,
            attemptMath[direction].y
          )
        );
        const inView = isInView(this._hostElement, document.body);
        if (inView.isInView) {
          this._hostElement.dataset["popupPosition"] = direction;
          break;
        }
      }
    }
    // computePosition: () => {
    //   this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF = this._dynamicRefs
    //     .POPUP_PROPS.SCROLLABLE_PARENT_REF
    //     ? this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF
    //     : this.HELPER_FUNCTIONS.getFloaterParentWithSelector(
    //       this.configuration.popupTargetElement,
    //       this.configuration.popupIsScrollableParentSelector
    //     );

    //   if (this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF) {
    //     const parentOverflow = isElementScrollable(
    //       this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF
    //     );
    //     if (parentOverflow.x || parentOverflow.y) {
    //       // there is an overflow/ scroll in one of the directions
    //       const inView = isInView(
    //         this.configuration.popupTargetElement,
    //         this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF
    //       );
    //       if (inView.isInView) {
    //         if (
    //           JSON.stringify(
    //             this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET
    //           ) !== JSON.stringify(inView.elementRect)
    //         ) {
    //           this._hostElement.setAttribute(
    //             "style",
    //             getStyleToShowFloater(
    //               inView.elementRect.right,
    //               inView.elementRect.top
    //             )
    //           );
    //           this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET =
    //             inView.elementRect;
    //         }
    //       } else {
    //         this._hostElement.setAttribute("style", getStyleToHideFloater());
    //         this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET =
    //           inView.elementRect;
    //       }
    //     }
    //   } else {
    //     throw new Error(
    //       CONSTANTS.MESSAGES.ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT
    //     );
    //   }
    // }
  };

  constructor(private configuration: IFloater.Configuration) {
    // extend config object with guid
    configuration.guid = nanoId();

    // create DOM
    this._hostElement = document.createElement("ARTICLE");
    this._hostElement.className = this.HELPER_FUNCTIONS.getClassName(
      this.configuration
    );
    this._hostElement.dataset["guid"] = configuration.guid;
    this._hostElement.dataset["isInitialising"] = "true";

    if (configuration.contentElement) {
      if (
        this.configuration.contentElementType ===
        IFloater.ContentElementType.TEMPLATE
      ) {
        this._hostElement.innerHTML = configuration.contentElement;
      } else if (
        this.configuration.contentElementType ===
        IFloater.ContentElementType.NODE
      ) {
        this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF =
          configuration.contentElement.parentElement;
        this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF = configuration
          .contentElement.nextElementSibling
          ? configuration.contentElement.nextElementSibling
          : configuration.contentElement.previousElementSibling;
        this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.IS_LAST_CHILD = configuration
          .contentElement.nextElementSibling
          ? false
          : true;
        this._hostElement.insertBefore(
          configuration.contentElement,
          this._hostElement.firstChild
        ); // first child is always empty.
      } else {
        throw new Error(
          CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_CONTENT_ELEMENT_TYPE
        );
      }
    }

    // add to floater instances
    floaterInstances.add(this);
  }

  show(): Promise<void> | void {
    const getCurrentInstanceOfType = floaterInstances.getInstancesOfType(
      this.configuration.type
    );
    if (this.configuration.type) {
      switch (this.configuration.type) {
        case IFloater.Type.MODAL: {
          return this.HELPER_FUNCTIONS.handleShowModal(
            getCurrentInstanceOfType
          );
        }
        case IFloater.Type.TOAST: {
          return this.HELPER_FUNCTIONS.handleShowToast(
            getCurrentInstanceOfType
          );
        }
        case IFloater.Type.POPUP: {
          return this.HELPER_FUNCTIONS.handleShowPopup(
            getCurrentInstanceOfType
          );
        }
        case IFloater.Type.SLIDEOUT: {
          return this.HELPER_FUNCTIONS.handleShowSlideOut(
            getCurrentInstanceOfType
          );
        }
      }
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_TYPE);
    }
  }

  destroy(): Promise<any> {
    // visual indicator for this element and delegate to the modal
    this._hostElement.dataset["isDestructing"] = "true";

    if (this.configuration.contentElement) {
      if (
        this.configuration.contentElementType ===
        IFloater.ContentElementType.NODE
      ) {
        if (this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF) {
          this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF.insertBefore(
            this.configuration.contentElement,
            !this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.IS_LAST_CHILD
              ? this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF
              : this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF
                  .nextSibling
          );
        }
      }
    }

    switch (this.configuration.type) {
      case IFloater.Type.MODAL:
        const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(
          IFloater.Type.MODAL
        );
        if (doesMaskAlreadyExist.length <= 1 && this.configuration.modalMask) {
          masker.destroy();
        }
        break;
      case IFloater.Type.TOAST:
        break;
      case IFloater.Type.POPUP:
        this.HELPER_FUNCTIONS.destructOnEscape(false);
        this.HELPER_FUNCTIONS.destructOnDocumentClick(false);
        if (this.configuration.popupMask) {
          this.HELPER_FUNCTIONS.destructOnPopupMask(false);
        }
        break;
    }

    if (this._dynamicRefs) {
      if (this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS) {
        for (let member in this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS) {
          this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS[member] = null;
        }
      }
      if (this._dynamicRefs.POPUP_PROPS) {
        for (let member in this._dynamicRefs.POPUP_PROPS) {
          this._dynamicRefs.POPUP_PROPS[member] = null;
        }
      }
      this._dynamicRefs = null;
    }
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        // remove floater instance management
        floaterInstances.destroy(this);
        // remove from DOM
        if (this._hostElement.parentElement) {
          this._hostElement.parentElement.removeChild(this._hostElement);
        }
        resolve();
      });
    });
  }

  getConfiguration(): IFloater.Configuration {
    return this.configuration;
  }

  getGuid(): string {
    return this.configuration.guid;
  }

  getContentElementWithSelector(selector: string): Element {
    return this._hostElement.getElementsByClassName(selector)[0];
  }

  getFloaterElementFromChild(contentChildElement: Element): Element {
    while (contentChildElement.parentNode) {
      contentChildElement = contentChildElement.parentNode as Element;
      if (
        contentChildElement &&
        contentChildElement.classList &&
        contentChildElement.classList.length &&
        contentChildElement.classList.contains("dom-floater-base")
      ) {
        return contentChildElement;
      }
    }
    return null;
  }
}
