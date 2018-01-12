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
        setTimeout(() => {
            this._hostElement.dataset['isInitialising'] = 'false';
        }, 0); // force re-paint
    }

    destroy() {
        this._hostElement
            .dataset['isDestructing'] = 'true';
        setTimeout(() => {
            this._hostElement
                .parentElement
                .removeChild(this._hostElement);
        }, CONSTANTS.TRANSITION_TIMES);
    }
}

export const masker = new Masker();