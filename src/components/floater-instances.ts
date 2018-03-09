import { IFloater } from "../interfaces";
import Floater from "./floater";

export class FloaterInstances {
  private _instances = {}; // dynamically created objects - key value pairs
  private _toastQueue: Floater[] = [];
  private _queuedIterator;
  private _queuedToast: Floater;

  add(floater: Floater) {
    this._instances[floater.getGuid()] = floater;
    if (floater.getConfiguration().type === IFloater.Type.TOAST) {
      console.log("GUID: " + floater.getGuid());
      this._toastQueue.push(floater);
    }
  }

  destroy(floater: Floater) {
    console.log("_toastQueue length: " + this._toastQueue.length);
    const guid = floater.getGuid();
    const floaterInstance: Floater = this._instances[guid];
    if (floaterInstance) floaterInstance.destroy();
    delete this._instances[guid];

    if (floater.getConfiguration().type === IFloater.Type.TOAST) {
      if (this._toastQueue.length) {
        this._toastQueue.pop().show();
      }
      // this._queuedToast = this.getQueuedToast();
      // if (this._queuedToast) {
      //   this._queuedToast.show();
      //   console.log("_toastQueue length: " + this._toastQueue.length);
      // }
    }
  }

  setQueuedToast(floater: Floater) {
    this._queuedToast = floater;
  }

  getQueuedToast(): Floater {
    this._queuedIterator =
      this._queuedIterator || (this.getNextToastFromQueue() as any);
    return this._queuedIterator.next().value;
  }

  *getNextToastFromQueue() {
    while (this._toastQueue.length) {
      yield this._toastQueue.pop();
    }
  }

  getInstanceById(guid: string): Floater {
    return this._instances[guid];
  }

  getInstancesOfType(instanceType: IFloater.Type): Array<Floater> {
    const instances = Object.keys(this._instances);
    let result = [];
    Object.keys(this._instances).forEach((instanceGuid: string) => {
      const instance: Floater = this.getInstanceById(instanceGuid);
      if (instance && instance.getConfiguration().type === instanceType) {
        result.push(instance);
      }
    });
    return result;
  }
}

export const floaterInstances = new FloaterInstances();
