import { CONSTANTS } from "./../constants";
import "./toaster-container.pcss";

export class ToasterContainer {
  private _hostElement: HTMLElement;

  init() {
    this._hostElement = document.createElement("DIV");
    this._hostElement.className = `dom-toaster-container-base`;
    this._hostElement.dataset["isInitialising"] = "true";
    document.body.appendChild(this._hostElement);
    requestAnimationFrame(() => {
      this._hostElement.dataset["isInitialising"] = "false";
    });
  }

  add(toastElement: HTMLElement) {
    this._hostElement.appendChild(toastElement);
  }

  getHostElement() {
    return this._hostElement;
  }

  destroy() {
    this._hostElement.dataset["isDestructing"] = "true";
    requestAnimationFrame(() => {
      if (this._hostElement && this._hostElement.parentElement) {
        this._hostElement.parentElement.removeChild(this._hostElement);
        this._hostElement = undefined;
        return;
      }
      this._hostElement = undefined;
    });
  }
}

export const toasterContainer = new ToasterContainer();
