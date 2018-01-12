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

  private _hostElement: HTMLElement;
  private _destroyBoundWithThis = this.destroy.bind(this);
  private _callbacks = {}; // dynamically constructed object

  configuration: IFloater.Configuration;

  constructor(configuration: IFloater.Configuration) {

    // extend config object with uid
    configuration.guid = nanoid(10);
    this.configuration = configuration;
    

    // create DOM
    this._hostElement = document.createElement('ARTICLE');
    this._hostElement.className = `dom-floater-base`;
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
    document.body.appendChild(this._hostElement);

    // only init a mask element if this is the first modal that is shown
    if (this.configuration.type === IFloater.Type.MODAL) {
      const doesMaskAlreadyExist = floaterInstances.getInstancesOfType(IFloater.Type.MODAL);
      if (doesMaskAlreadyExist.length <= 1) {
        masker.init();
      }
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => { // the time out waits for the css kicks in.
        this._hostElement.dataset[`isInitialising`] = `false`;
      }, 0);
      setTimeout(() => {
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
        this._hostElement.parentElement.removeChild(this._hostElement)
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    })
  }

}
