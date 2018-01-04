import { Masker } from './masker';
import './floater.pcss';
import { IFloater } from '../interfaces';
/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.BaseComponent {
    destroyBoundWithThis: any;
    modalBackground: Masker;
    hostElement: HTMLElement;
    constructor(child: HTMLElement, fixedDimensions?: IFloater.Dimensions);
    /**
     * Shows
     * @param {Element} child we need to keep the reference to keep custom functionality in the child
     */
    init(parentElement?: HTMLElement): Promise<void>;
    addListeners(): void;
    destroy(): Promise<any>;
}
