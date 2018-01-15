import * as nanoid from 'nanoid';
import { CONSTANTS } from './../constants';
import './floater.pcss';
import { IFloater } from '../interfaces';
import { floaterInstances } from './floater-instances';
import { masker } from './masker';
import { toasterContainer } from './toaster-container';
import { positionFloater } from '../util';

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {

  private _hostElement: HTMLElement; // TODO: this needs to be private

  private _destroyBoundWithThis = this.destroy.bind(this);
  private _callbacks = {}; // dynamically constructed object

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

    if (configuration.dimensions) {
      this._hostElement.style.width = `${configuration.dimensions.width}px`
      this._hostElement.style.height = `${configuration.dimensions.height}px`
    }

    // manage floater instance
    floaterInstances.add(this);
  }

  show(): Promise<void> {

    const getCurrentInstanceOfType = floaterInstances.getInstancesOfType(this.configuration.type);
    // HANDLE MODAL
    if (this.configuration.type === IFloater.Type.MODAL) {
      // only init a mask element if this is the first modal that is shown
      if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
        masker.init();
      }
      // create Modal
      document.body.appendChild(this._hostElement);
    }

    // HANDLE TOAST
    else if (this.configuration.type === IFloater.Type.TOAST) {
      // only init a toast container element if does not exist
      if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
        toasterContainer.init();
      }
      toasterContainer.add(this._hostElement);

      if (this.configuration.expiry) {
        this.destructOnExpiry(this.configuration.expiry)();
      }

    }

    // HANDLE POPUP
    else if (this.configuration.type === IFloater.Type.POPUP) {

      // create new popup
      if (this.configuration.popupTargetElement) {
        document.body.appendChild(this._hostElement);
        const rect: ClientRect = this.configuration.popupTargetElement.getBoundingClientRect();
        this._hostElement.setAttribute('style', positionFloater(rect.right, rect.top));
      } else {
        throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_TYPE);
      }

      // and delete the previous one
      if (getCurrentInstanceOfType && getCurrentInstanceOfType.length > 0) {
        //dispose old one
        getCurrentInstanceOfType.forEach((instance: Floater) => {
          if (instance.configuration.guid !== this.configuration.guid) {
            instance.destroy();
          }
        })
      }

    }
    else {
      throw new Error(CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_POPUP_TARGET);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => { // the time out waits for the css kicks in.
        this._hostElement.dataset[`isInitialising`] = `false`;
      }, 0);
      setTimeout(() => {
        if (this.configuration.type === IFloater.Type.POPUP) {
          this.destructOnEscape();
          this.destructOnDocumentClick();
        }
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    });

  }



  destroy(): Promise<any> {
    // visual indicator for this element and delegate to the modal
    this._hostElement.dataset['isDestructing'] = 'true';

    // only init a mask element if this is the first modal that is shown
    if (this.configuration.type === IFloater.Type.MODAL) {
      const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(IFloater.Type.MODAL);
      if (doesMaskAlreadyExist.length <= 1) {
        masker.destroy();
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        // remove floater instance management
        floaterInstances.destroy(this);
        // remove from DOM
        if (this._hostElement.parentElement) {
          this._hostElement.parentElement.removeChild(this._hostElement);
        }
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    });

  }

  getContentElementWithSelector(selector: string): Element {
    return this._hostElement.getElementsByClassName(selector)[0];
  }

  getFloaterElementFromChild(contentChildElement: Element) {
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

  private destructOnExpiry(expiryDurtaion: number) {
    let timer;
    return () => {
      clearTimeout(timer); // be sure to clear if object exists.
      timer = setTimeout(() => {
        this._destroyBoundWithThis();
        clearTimeout(timer);
      }, 5000);
    };
  }



  private destructOnEscape() {
    document.addEventListener('keyup',
      (event: KeyboardEvent) => {
        if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
          this._destroyBoundWithThis();
        }
      });
  }

  private destructOnDocumentClick() {
    document.addEventListener('click',
      (event: MouseEvent) => {
        const isChildElement = this.getFloaterElementFromChild(event.srcElement);
        if (isChildElement === null) {
          this._destroyBoundWithThis();
        }
      });
  }

}
