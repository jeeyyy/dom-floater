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
        requestAnimationFrame(() => {
            this._hostElement.dataset['isInitialising'] = 'false';
        });
    }

    add(toastElement: HTMLElement) {
        this._hostElement.appendChild(toastElement);
    }



    destroy() {
        this._hostElement.dataset['isDestructing'] = 'true';
        requestAnimationFrame(() => {
            this._hostElement
                .parentElement
                .removeChild(this._hostElement);
        });
    }
}

export const toasterContainer = new ToasterContainer();