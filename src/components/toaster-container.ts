import { CONSTANTS } from './../constants';
import './toaster-container.pcss';

export class ToasterContainer {

    private _hostElement: HTMLElement;

    constructor() { }

    init() {
        this._hostElement = document.createElement('DIV');
        this._hostElement.className = `dom-toaster-container-base`;
        this._hostElement.dataset['isInitialising'] = 'true';
        document.body.appendChild(this._hostElement);

        setTimeout(() => {
            this._hostElement.dataset['isInitialising'] = 'false';
        }, 0); // force re-paint
    }

    add(toastElement: HTMLElement) {
        this._hostElement.appendChild(toastElement);
    }

    

    destroy() {
        this._hostElement.dataset['isDestructing'] = 'true';
        setTimeout(() => {
            this._hostElement
                .parentElement
                .removeChild(this._hostElement);
        }, CONSTANTS.TRANSITION_TIMES);
    }
}

export const toasterContainer = new ToasterContainer();