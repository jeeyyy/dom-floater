// import * as DomFloater from '../dist/dom-floater.js';
import * as dF from '../src/index';
import { IFloater } from '../src/interfaces';
import { setTimeout } from 'timers';
const Floater = dF.DomFloater.default;

const showModal = () => {

    // setTimeout(() =>  {
    //     floater.destroy();
    // }, 500);
};

const showToast = () => {
    const config: IFloater.Configuration = {
        type: IFloater.Type.TOAST,
        contentElement: `<div>Some Toast Content</div>`
    };
    const floater = new Floater(config);
    floater.show();
};

document
    .getElementById(`createModal`)
    .addEventListener('click', () => {
        const config: IFloater.Configuration = {
            type: IFloater.Type.MODAL,
            contentElement: `<div>Some Modal Content.</div>`
        };
        const floater = new Floater(config);
        floater.show();
    });

document.getElementById(`createToast`).addEventListener('click', () => {
    showToast();
});

// showModal();