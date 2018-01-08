import * as nanoid from 'nanoid';
import { CONSTANTS } from './../constants';

import './floater.pcss';
import { IFloater } from '../interfaces';
import { floaterInstances } from './floater-instances';

import { masker } from './masker';

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {

  hostElement: HTMLElement;
  destroyBoundWithThis = this.destroy.bind(this);
  configuration: IFloater.Configuration;

  constructor(configuration: IFloater.Configuration) {

    // extend config object with uid
    configuration.guid = nanoid(10);
    this.configuration = configuration;
    // manage floater instance
    floaterInstances.add(this.configuration);

    // create DOM
    this.hostElement = document.createElement('ARTICLE');
    this.hostElement.className = `dom-floater-base`;
    this.hostElement.dataset['isInitialising'] = 'true';

    if (configuration.contentElement) {
      this.hostElement.innerHTML = configuration.contentElement;
    }

    if (configuration.dimensions) {
      this.hostElement.style.width = `${configuration.dimensions.width}px`
      this.hostElement.style.height = `${configuration.dimensions.height}px`
    }

  }

  show(): Promise<void> {

    document.body.appendChild(this.hostElement);

    // only init a mask element if this is the first modal that is shown
    if (this.configuration.type === IFloater.Type.MODAL) {
      const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(IFloater.Type.MODAL);
      if (doesMaskAlreadyExist.length <= 1) {
        masker.init();
      }
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => { // the time out waits for the css kicks in.
        this.hostElement.dataset[`isInitialising`] = `false`;
      }, 0);

      setTimeout(() => {
        this.addListeners();
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    });

  }

  destroy(): Promise<any> {
    // visual indicator for this element and delegate to the modal
    this.hostElement.dataset['isDestructing'] = 'true';

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
        floaterInstances.remove(this.configuration);
        // remove from DOM
        this.hostElement.parentElement.removeChild(this.hostElement)
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    })
  }

  private addListeners() {
    // document.addEventListener('keyup', function (event) {
    //   if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
    //     this.destroyBoundWithThis();
    //   }
    // }.bind(this));
  }

}
