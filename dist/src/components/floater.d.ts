import './floater.pcss';
import { IFloater } from '../interfaces';
/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {
    hostElement: HTMLElement;
    destroyBoundWithThis: any;
    configuration: IFloater.Configuration;
    constructor(configuration: IFloater.Configuration);
    show(): Promise<void>;
    destroy(): Promise<any>;
    private addListeners();
}
