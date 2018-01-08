
class BaseElement {

    private _elements: HTMLElement[] = [];

    constructor() { }

    initBaseElement() {
        let element = document.createElement('DIV');
        element.className = `dom-masker-base`;
        element.dataset['isInitialising'] = 'true';
        document.body.appendChild(element);
        setTimeout(() => {
            element.dataset['isInitialising'] = 'false';
        }, 0); // force re-paint
    }
}