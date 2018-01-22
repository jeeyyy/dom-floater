const nanoId = require('nanoid');
const requestInterval = require("request-interval");
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
  private _destroyBoundWithThis = this.destroy.bind(this);
  private _callbacks = {}; // dynamically constructed object

  private _popupPositioningScrollableParentElement = null;
  private _popupPositioningInterval = null;
  private _popupPreviousComputedTargetElRect = null;

  private _getClassName(config: IFloater.Configuration) {
    let baseClass = `dom-floater-base ${config.type}`
    switch (config.type) {
      case IFloater.Type.MODAL:
        return `${baseClass} ${config.modalMask && 'MASK'}`;
      case IFloater.Type.TOAST:
        return `${baseClass} ${config.toastPosition ? config.toastPosition : ''}`;
      case IFloater.Type.POPUP:
        return `${baseClass}`;
      case IFloater.Type.SLIDEOUT:
        return `${baseClass} ${config.slideOutPosition ? config.slideOutPosition : ''} ${config.slideOutMask && 'MASK'}`;
    }
  }

  constructor(private configuration: IFloater.Configuration) {
    // extend config object with guid
    configuration.guid = nanoId();

    // create DOM
    this._hostElement = document.createElement("ARTICLE");
    this._hostElement.className = this._getClassName(this.configuration);
    this._hostElement.dataset["guid"] = configuration.guid;
    this._hostElement.dataset["isInitialising"] = "true";

    if (configuration.contentElement) {
      if (this.configuration.contentElementType === IFloater.ContentElementType.TEMPLATE) {
        this._hostElement.innerHTML = configuration.contentElement;
      }
      else if (this.configuration.contentElementType === IFloater.ContentElementType.NODE) {
        this._hostElement.insertBefore(configuration.contentElement, this._hostElement.firstChild); // first child is always empty.
      } else {
        throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_CONTENT_ELEMENT_TYPE)
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
          return this._handleShowModal(getCurrentInstanceOfType);
        }
        case IFloater.Type.TOAST: {
          return this._handleShowToast(getCurrentInstanceOfType);
        }
        case IFloater.Type.POPUP: {
          return this._handleShowPopup(getCurrentInstanceOfType);
        }
        case IFloater.Type.SLIDEOUT: {
          return this._handleShowSlideOut(getCurrentInstanceOfType);
        }
      }
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_TYPE);
    }
  }

  destroy(): Promise<any> {
    // visual indicator for this element and delegate to the modal
    this._hostElement.dataset["isDestructing"] = "true";
    switch (this.configuration.type) {
      case IFloater.Type.MODAL:
        const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(
          IFloater.Type.MODAL
        );
        if (doesMaskAlreadyExist.length <= 1) {
          masker.destroy();
        }
        break;
      case IFloater.Type.TOAST:
        break;
      case IFloater.Type.POPUP:
        if (this._popupPositioningInterval) {
          requestInterval.clear(this._popupPositioningInterval);
          this._popupPositioningInterval = null;
        }
        this._popupPositioningScrollableParentElement = null;
        this._popupPreviousComputedTargetElRect = null;
        break;
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

  private _getFloaterParentWithSelector(
    startEl: HTMLElement,
    selector: string
  ): HTMLElement {
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
  }

  private _destructOnExpiry(expiryDurtaion: number) {
    let timer;
    return () => {
      clearTimeout(timer); // be sure to clear if object exists.
      timer = setTimeout(() => {
        this._destroyBoundWithThis();
        clearTimeout(timer);
      }, expiryDurtaion);
    };
  }

  private _destructOnEscape() {
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
        this._destroyBoundWithThis();
      }
    });
  }

  private _destructOnDocumentClick() {
    document.addEventListener("click", (event: MouseEvent) => {
      const isChildElement = this.getFloaterElementFromChild(event.srcElement);
      if (isChildElement === null) {
        this._destroyBoundWithThis();
      }
    });
  }

  private _handleShowModal(getCurrentInstanceOfType: Floater[]) {
    // only init a mask element if this is the first modal that is shown
    if (
      getCurrentInstanceOfType &&
      getCurrentInstanceOfType.length <= 1 &&
      this.configuration.modalMask) {
      masker.init();
    }
    // create Modal
    document.body.appendChild(this._hostElement);
    this._handleShow();
  }

  private _handleShowToast(getCurrentInstanceOfType: Floater[]) {
    // only init a toast container element if does not exist
    if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
      toasterContainer.init();
    }
    toasterContainer.add(this._hostElement);
    // if has expiry - start destruction timer
    if (this.configuration.expiry) {
      this._destructOnExpiry(this.configuration.expiry)();
    }
    this._handleShow();
  }

  private _handleShowPopup(getCurrentInstanceOfType: Floater[]) {
    if (this.configuration.popupTargetElement) {
      document.body.appendChild(this._hostElement);
      this._positionPopup();
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_POPUP_TARGET);
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
    this._handleShow();
  }

  private _handleShowSlideOut(getCurrentInstanceOfType: Floater[]) {
    if (this.configuration.slideOutTargetElement) {
      this.configuration.slideOutTargetElement.insertBefore(this._hostElement, this.configuration.slideOutTargetElement.firstChild);
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_SLIDEOUT_TARGET);
    }
    this._handleShow();
  }

  private _handleShow() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        // the time out waits for the css kicks in.
        this._hostElement.dataset[`isInitialising`] = `false`;
      });
      requestAnimationFrame(() => {
        if (this.configuration.type === IFloater.Type.POPUP) {
          this._destructOnEscape();
          this._destructOnDocumentClick();
        }
        resolve();
      });
    });
  }

  private _positionPopup() {
    if (this.configuration.popupIsScrollableParentSelector) {
      // if a scrollable parent's selector is provided - get the parent scrollable element
      this._popupPositioningInterval = requestInterval(
        CONSTANTS.TIME_SPAN.MS_50,
        () => {
          this._computePosition();
        }
      );
      this._computePosition();
    } else {
      // there is no parent that can scroll, so position next to target element & do not watch to update on viewport changes.
      const targetElRect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
      this._hostElement.setAttribute(
        "style",
        getStyleToShowFloater(targetElRect.right, targetElRect.top)
      );
    }
  }

  private _computePosition() {
    this._popupPositioningScrollableParentElement = this
      ._popupPositioningScrollableParentElement
      ? this._popupPositioningScrollableParentElement
      : this._getFloaterParentWithSelector(this.configuration.popupTargetElement, this.configuration.popupIsScrollableParentSelector);
    if (this._popupPositioningScrollableParentElement) {
      const parentOverflow = isElementScrollable(
        this._popupPositioningScrollableParentElement
      );
      if (parentOverflow.x || parentOverflow.y) {
        // there is an overflow/ scroll in one of the directions
        const inView = isInView(
          this.configuration.popupTargetElement,
          this._popupPositioningScrollableParentElement
        );
        if (inView.isInView) {
          if (
            JSON.stringify(this._popupPreviousComputedTargetElRect) !==
            JSON.stringify(inView.elementRect)
          ) {
            this._hostElement.setAttribute(
              "style",
              getStyleToShowFloater(
                inView.elementRect.right,
                inView.elementRect.top
              )
            );
            this._popupPreviousComputedTargetElRect = inView.elementRect;
          }
        } else {
          this._hostElement.setAttribute("style", getStyleToHideFloater());
          this._popupPreviousComputedTargetElRect = inView.elementRect;
        }
      }
    } else {
      throw new Error(
        CONSTANTS.MESSAGES.ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT
      );
    }
  }
}
