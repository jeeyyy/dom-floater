// import * as DomFloater from '../dist/dom-floater.js';
// import * as dF from '../src/index';
import * as dF from '../dist/dom-floater';
import { IFloater } from '../src/interfaces';

const Floater = dF.DomFloater.default;
const FloaterManager = dF.DomFloaterManager;

const createFloater = (config) => {
    
    const floater = new Floater(config);
    floater.show();    
    // JUST FOR TESTING
    setTimeout(() => {
        let closeButton = floater.getContentElementWithSelector('close-button');
        if (closeButton) {
            closeButton.addEventListener('click', (e: Event) => {
                const f = floater.getFloaterElementFromChild(e.srcElement);
                if (f) {
                    const guid = f.getAttribute('data-guid');
                    const floater = FloaterManager.getInstanceById(guid);
                    FloaterManager.destroy(floater);
                }
            });
        }
    }, 0);
}

document
    .getElementById(`createModal`)
    .addEventListener('click', () => {
        const node = document.getElementsByClassName('nodeMoveTest')[0];
        node.addEventListener('click', () => {
            console.log('clicked');
        })
        const config: IFloater.Configuration = {
            type: IFloater.Type.MODAL,
            // contentElement: `
            // <div>
            //     Some Modal Content. ${ Math.floor(Math.random() * 100)}
            //     <button 
            //         type='button'
            //         class='close-button'
            //         >
            //         Close
            //     </button>
            // </div>`,
            contentElement: node,
            contentElementType: IFloater.ContentElementType.NODE
        };
        createFloater(config);
    });

document
    .getElementById(`createToast`)
    .addEventListener('click', () => {
        const config: IFloater.Configuration = {
            type: IFloater.Type.TOAST,
            contentElement: `
            <div>
                Some Toast Content. ${ Math.floor(Math.random() * 100)}
                <button 
                    type='button'
                    class='close-button'
                    >
                    Close
                </button>
            </div>`,
            contentElementType: IFloater.ContentElementType.TEMPLATE,
            expiry: 1000
        };
        createFloater(config);
    });

document
    .getElementById(`createPopup`)
    .addEventListener('click', (e: Event) => {
        const value = (document.getElementById('popupDiv') as HTMLInputElement).value;
        const popupTargetElement =
            value.length > 0
                ? document.getElementById(value)
                : e.srcElement as HTMLElement;
        const popupIsScrollableParentSelector = value.length > 0 ? 'overflowingPanel' : null;
        const config: IFloater.Configuration = {
            type: IFloater.Type.POPUP,
            contentElement: `
            <div>
                Some Toast Content. ${ Math.floor(Math.random() * 100)}
                <button 
                    type='button'
                    class='close-button'
                    >
                    Close
                </button>
            </div>`,
            contentElementType: IFloater.ContentElementType.TEMPLATE,
            popupTargetElement: popupTargetElement,
            popupIsScrollableParentSelector: popupIsScrollableParentSelector
        };
        createFloater(config);
    });
