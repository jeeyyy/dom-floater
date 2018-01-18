import * as nanoid from 'nanoid';
import * as requestInterval from 'request-interval';
import './floater.pcss';
import { CONSTANTS } from './../constants';
import { IFloater } from '../interfaces';
import { floaterInstances } from './floater-instances';
import { masker } from './masker';
import { toasterContainer } from './toaster-container';
import { getFloaterPositionStyle, isElementScrollable } from '../util';

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

  configuration: IFloater.Configuration;

  constructor(configuration: IFloater.Configuration) {
    // extend config object with uid
    configuration.guid = nanoid(10);
    this.configuration = configuration;

    // create DOM
    this._hostElement = document.createElement('ARTICLE');
    this._hostElement.className = `dom-floater-base ${configuration.type}`;
    this._hostElement.dataset['guid'] = configuration.guid;
    this._hostElement.dataset['isInitialising'] = 'true';

    if (configuration.contentElement) {
      this._hostElement.innerHTML = configuration.contentElement;
    }

    // add to floater instances
    floaterInstances.add(this);
  }


  show(): Promise<void> | void {
    const getCurrentInstanceOfType = floaterInstances.getInstancesOfType(this.configuration.type);
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
      }
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_TYPE);
    }
  }

  destroy(): Promise<any> {
    // visual indicator for this element and delegate to the modal
    this._hostElement.dataset['isDestructing'] = 'true';
    switch (this.configuration.type) {
      case IFloater.Type.MODAL: {
        const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(IFloater.Type.MODAL);
        if (doesMaskAlreadyExist.length <= 1) {
          masker.destroy();
        }
      }
      case IFloater.Type.TOAST: {
      }
      case IFloater.Type.POPUP: {
        if (this._popupPositioningInterval) {
          requestInterval.clear(this._popupPositioningInterval);
        }
      }
    }
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        // remove floater instance management
        floaterInstances.destroy(this);
        // remove from DOM
        if (this._hostElement.parentElement) {
          this._hostElement.parentElement.removeChild(this._hostElement);
        }
        resolve();
      })
    });
  }

  getContentElementWithSelector(selector: string): Element {
    return this._hostElement.getElementsByClassName(selector)[0];
  }

  getFloaterElementFromChild(contentChildElement: Element): Element {
    while (contentChildElement.parentNode) {
      contentChildElement = contentChildElement.parentNode as Element;
      if (contentChildElement &&
        contentChildElement.classList &&
        contentChildElement.classList.length &&
        contentChildElement.classList.contains('dom-floater-base')) {
        return contentChildElement;
      }
    }
    return null;
  }

  private _getFloaterParentWithSelector(startEl: HTMLElement, selector: string): HTMLElement {
    while (startEl.parentNode) {
      startEl = startEl.parentNode as HTMLElement;
      if (startEl &&
        startEl.classList &&
        startEl.classList.length &&
        startEl.classList.contains(selector)) {
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
    document.addEventListener('keyup',
      (event: KeyboardEvent) => {
        if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
          this._destroyBoundWithThis();
        }
      });
  }

  private _destructOnDocumentClick() {
    document.addEventListener('click',
      (event: MouseEvent) => {
        const isChildElement = this.getFloaterElementFromChild(event.srcElement);
        if (isChildElement === null) {
          this._destroyBoundWithThis();
        }
      });
  }


  private _handleShowModal(getCurrentInstanceOfType: Floater[]) {
    // only init a mask element if this is the first modal that is shown
    if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
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
      document
        .body
        .appendChild(this._hostElement);
    } else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_POPUP_TARGET);
    }
    // and delete the previous one
    if (getCurrentInstanceOfType && getCurrentInstanceOfType.length > 0) {
      //dispose old one
      getCurrentInstanceOfType
        .forEach((instance: Floater) => {
          if (instance.configuration.guid !== this.configuration.guid) {
            instance.destroy();
          }
        });
    }
    this._handleShow();
  }




  private _handleShow() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => { // the time out waits for the css kicks in.
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

  // const position = (dom) => {
  //   const isScrollable = isElementScrollable(dom);
  //   console.log(isScrollable, dom);
  // }

  private isChildVisibleInsideParent(parent: HTMLElement, child: HTMLElement) {
    const pR: ClientRect = parent.getBoundingClientRect();
    const cR: ClientRect = child.getBoundingClientRect();

    const pOverflow = isElementScrollable(parent);
    if(pOverflow.y) {
      const cH = Math.abs(cR.bottom - cR.top);
      
    }
    
  }

  private _positionPopup() {
    if (this.configuration.popupIsScrollableParentSelector) {
      this._popupPositioningInterval = requestInterval(300, () => {

      });
    }

    if (this.configuration.popupIsScrollableParentSelector) {
      this._popupPositioningScrollableParentElement =
        this._popupPositioningScrollableParentElement
          ? this._popupPositioningScrollableParentElement
          : this._getFloaterParentWithSelector(this.configuration.popupTargetElement, this.configuration.popupIsScrollableParentSelector);
      if (this._popupPositioningScrollableParentElement) {

        const parentOverflow = isElementScrollable(this._popupPositioningScrollableParentElement);
        const getElRect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
        const targetElRect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
        if (parentOverflow.y) {
          let childHeight
        }

      } else {
        throw new Error(CONSTANTS.MESSAGES.ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT);
      }
    } else {
      const targetElRect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
      this._hostElement.setAttribute('style', getFloaterPositionStyle(targetElRect.right, targetElRect.top));
    }
  }

}
