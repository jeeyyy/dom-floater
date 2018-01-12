// import * as DomFloater from '../dist/dom-floater.js';
import * as dF from '../src/index';
import { IFloater } from '../src/interfaces';

const Floater = dF.DomFloater.default;
const FloaterManager = dF.DomFloaterManager;

const fakeClose = (floater) => {
    setTimeout(() => {
        let closeButton = document.getElementById('close-button');
        if(closeButton) {
            closeButton.addEventListener('click', () => {
                FloaterManager.destroy(floater);
            });
        }
    }, 200);
}

const createFloater = () => {

    const config: IFloater.Configuration = {
        type: IFloater.Type.MODAL,
        contentElement: `
        <div>
            Some Modal Content.
            <button 
                type='button'
                id='close-button'>
                Close
            </button>
        </div>`
    };
    const floater = new Floater(config);    
    floater.show();
    fakeClose(floater);
    
}

document
    .getElementById(`createModal`)
    .addEventListener('click', () => {
        createFloater();
    });

document
    .getElementById(`createToast`)
    .addEventListener('click', () => {
        alert('NOT IMPLEMENTED');
    });
