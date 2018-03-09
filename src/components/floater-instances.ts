import { IFloater } from "../interfaces";
import Floater from "./floater";

export class FloaterInstances {
  private _instances = {}; // dynamically created objects - key value pairs
  private _toastInitiated: boolean = false;

  add(floater: Floater) {
    this._instances[floater.getGuid()] = floater;
  }

  destroy(floater: Floater) {
    const guid = floater.getGuid();
    const floaterInstance: Floater = this._instances[guid];
    if (floaterInstance) floaterInstance.destroy();
    delete this._instances[guid];

    if (floater.getConfiguration().type === IFloater.Type.TOAST) {
      const floater = this.getInstancesOfType(IFloater.Type.TOAST);
      if (floater && floater.length) {
        floater[0].showNextToast(floater);
      } else {
        this._toastInitiated = false;
      }
    }
  }

  isToastInitiated(): boolean {
    return this._toastInitiated;
  }

  initiateToast() {
    this._toastInitiated = true;
  }

  getInstanceById(guid: string): Floater {
    return this._instances[guid];
  }

  getInstancesOfType(instanceType: IFloater.Type): Array<Floater> {
    return Object.keys(this._instances).reduce((acc: any[], instanceGuid: string, cI: number, arr: any[]) => {
      const instance: Floater = this.getInstanceById(instanceGuid);
      if (instance && instance.getConfiguration().type === instanceType) {
        acc.push(instance);
      }
      return acc;
    }, []).sort((prev: Floater, next: Floater) => {
      return prev.getCreatedTimeStamp() - next.getCreatedTimeStamp()
    });
  }

}

export const floaterInstances = new FloaterInstances();
