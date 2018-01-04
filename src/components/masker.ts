import { CONSTANTS } from './../constants';

import './masker.pcss'

export class Masker {

    private destroyBoundWithThis = this.destroy.bind(this);
    private hostElement: HTMLElement;

    constructor() { }

    init() {

        this.hostElement = document.createElement('DIV');
        this.hostElement.className = `dom-masker-base`;
        this.hostElement.dataset['isInitialising'] = 'true';

        document.body.appendChild(this.hostElement)

        setTimeout(() => {
            this.hostElement.dataset['isInitialising'] = 'false';
        }, 0); // force re-paint
    }

    destroy() {
        this.hostElement.dataset['isDestructing'] = 'true';

        setTimeout(() => {
            this.hostElement.parentElement.removeChild(this.hostElement)
        }, CONSTANTS.TRANSITION_TIMES);
    }
}