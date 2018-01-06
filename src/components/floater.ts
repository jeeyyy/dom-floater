import { Masker } from './masker';
import { CONSTANTS } from './../constants';

import './floater.pcss';
import { IFloater } from '../interfaces';

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.BaseComponent {

  destroyBoundWithThis = this.destroy.bind(this);
  modalBackground = new Masker();
  hostElement: HTMLElement;

  constructor(
    child: HTMLElement,
    fixedDimensions?: IFloater.Dimensions) {
    const tempElement: HTMLElement = document.createElement('DIV');

    tempElement.innerHTML =
      `<article class='dom-floater-base' data-is-initialising='true'>
        <a class='close'><!--&#x274c-->&#x2716</a>
          <div class='childContainer'></div>
       </article>`;

    this.hostElement = tempElement.firstChild as HTMLElement;

    this.hostElement.querySelector('.childContainer').appendChild(child);

    if (fixedDimensions) {
      this.hostElement.style.width = `${fixedDimensions.width}px`
      this.hostElement.style.height = `${fixedDimensions.height}px`
    }

  }

  /**
   * Shows
   * @param {Element} child we need to keep the reference to keep custom functionality in the child
   */
  init(parentElement?: HTMLElement): Promise<void> {
    document.body.appendChild(this.hostElement)
    // let currentWidth = window.getComputedStyle(document.querySelector('p'))

    this.modalBackground.init()

    return new Promise((resolve, reject) => {
      // we need to set this in a timeout in order to trigger the css transition
      setTimeout(() => {
        this.hostElement.dataset['isInitialising'] = 'false';
      });
      // when the popup is has finished moving via the css transition resolve the promise to tell the callee
      setTimeout(() => {
        // todo use dynamic width for better centering
        // let currentWidth = window.getComputedStyle(document.querySelector('p')) }, 50)
        this.addListeners();
        resolve();
      }, CONSTANTS.TRANSITION_TIMES);
    })
  }

  addListeners() {

    const closeElement = this.hostElement.querySelector('a');

    closeElement.addEventListener('click', this.destroyBoundWithThis);
    this.hostElement.classList.remove('offscreen');

    document.addEventListener('keyup', function (event) {
      if (event.keyCode === CONSTANTS.COMMON_KEY_CODES.ESC) {
        this.destroyBoundWithThis();
      }
    }.bind(this));

    this.hostElement.addEventListener('submit', function (event) {
      this.destroyBoundWithThis();
      event.preventDefault();
    }.bind(this));

    // handle the first child submit button click, close popup by default
    // this is a convention that gets popup to behave in sensible way
    const submitBtn = this.hostElement.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.addEventListener('click', this.destroyBoundWithThis)
    }
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
}