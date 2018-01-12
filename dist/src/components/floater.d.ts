import './floater.pcss';
import { IFloater } from '../interfaces';
/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {
    private _hostElement;
    private _destroyBoundWithThis;
    private _callbacks;
    configuration: IFloater.Configuration;
    constructor(configuration: IFloater.Configuration);
    show(): Promise<void>;
    destroy(): Promise<any>;
    getContentElementWithSelector(selector: string): Element;
    getFloaterElementFromChild(contentChildElement: Element): Element;
}
