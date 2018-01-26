import "./floater.pcss";
import { IFloater } from "../interfaces";
/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
export default class Floater implements IFloater.Component {
    private configuration;
    private _hostElement;
    private _destroyBoundWithThis;
    private _callbacks;
    private _dynamicRefs;
    constructor(configuration: IFloater.Configuration);
    show(): Promise<void> | void;
    destroy(): Promise<any>;
    getConfiguration(): IFloater.Configuration;
    getGuid(): string;
    getContentElementWithSelector(selector: string): Element;
    getFloaterElementFromChild(contentChildElement: Element): Element;
    private _getClassName(config);
    private _getFloaterParentWithSelector(startEl, selector);
    private _destructOnExpiry(expiryDurtaion);
    private _destructOnEscape();
    private _destructOnDocumentClick();
    private _handleShowModal(getCurrentInstanceOfType);
    private _handleShowToast(getCurrentInstanceOfType);
    private _handleShowPopup(getCurrentInstanceOfType);
    private _handleShowSlideOut(getCurrentInstanceOfType);
    private _handleShow();
    private _positionPopup();
    private _computePosition();
}
