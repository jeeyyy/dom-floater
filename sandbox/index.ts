// import * as DomFloater from '../dist/dom-floater.js';
import * as dF from '../src/index';
let Floater = dF.DomFloater.default;

function showModal() {
    var child: HTMLElement = document.createElement('DIV')
    child.innerHTML =
        `<p>This is some content that can be supplied to the popup</p>
             <p>Also press the [ESC] key to close]</p>
             <button type="submit">Clicking a submit button will also close it</button>
          `
    var popup = new Floater(child)
    popup.init();
}

showModal();
showModal();
showModal();