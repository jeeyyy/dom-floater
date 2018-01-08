import { Masker } from './masker';
import { CONSTANTS } from './../constants';

import './floater.pcss';
import { IFloater } from '../interfaces';
import { setTimeout } from 'timers';

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {

  hostElement: HTMLElement;
  destroyBoundWithThis = this.destroy.bind(this);
  modalBackground = new Masker();


  constructor(configuration: IFloater.Configuration) {
    this.hostElement = document.createElement(`DIV`);
    this.hostElement.innerHTML = `
    <article class='dom-floater-base' data-is-initialising='true'>
    </article>
    `;
    if (configuration.contentElement) {
      const contentContainer = document.createElement(`DIV`);
      contentContainer.innerHTML = configuration.contentElement;
      this.hostElement.firstElementChild.appendChild(contentContainer);
    }
    if (configuration.dimensions) {
      this.hostElement.style.width = `${configuration.dimensions.width}px`
      this.hostElement.style.height = `${configuration.dimensions.height}px`
    }
  }

  show(): Promise<void> {
    document.body.appendChild(this.hostElement);
    this.modalBackground.init();
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
    this.modalBackground.destroy();

    return new Promise((resolve) => {
      setTimeout(() => {
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
