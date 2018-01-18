import { CONSTANTS } from './../constants';
import './masker.pcss';

export class Masker {

    private _hostElement: HTMLElement;

    constructor() { }

    init() {
        this._hostElement = document.createElement('DIV');
        this._hostElement.className = `dom-masker-base`;
        this._hostElement.dataset['isInitialising'] = 'true';
        document.body.appendChild(this._hostElement);
        requestAnimationFrame(() => { // force re-paint
            this._hostElement.dataset['isInitialising'] = 'false';
        });
    }

    destroy() {
        this._hostElement
            .dataset['isDestructing'] = 'true';
        requestAnimationFrame(() => {
            this._hostElement
                .parentElement
                .removeChild(this._hostElement);
        });
    }
}

export const masker = new Masker();