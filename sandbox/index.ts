// import * as DomFloater from '../dist/dom-floater.js';
import * as dF from '../src/index';
import { IFloater } from '../src/interfaces';
import { setTimeout } from 'timers';
const Floater = dF.DomFloater.default;



const showModal = () => {

    const config: IFloater.Configuration = {
        type: IFloater.Type.MODAL,
        contentElement: `
        <div>
            Some content.
        </div>
        `
    };

    const popup = new Floater(config);
    popup.show();
    // setTimeout(() =>  {
    //     popup.destroy();
    // }, 500);
}

showModal();
// showModal();
// showModal();