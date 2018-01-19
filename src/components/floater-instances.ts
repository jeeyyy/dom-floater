import { IFloater } from "../interfaces";
import Floater from "./floater";

export class FloaterInstances {
  private _instances = {}; // dynamically created objects - key value pairs

  add(floater: Floater) {
    this._instances[floater.configuration.guid] = floater;
    console.debug(this._instances);
  }

  destroy(floater: Floater) {
    const guid = floater.configuration.guid;
    const floaterInstance: Floater = this._instances[guid];
    if (floaterInstance) floaterInstance.destroy();
    delete this._instances[guid];
    console.debug(this._instances);
  }

  getInstanceById(guid: string): Floater {
    return this._instances[guid];
  }

  getInstancesOfType(instanceType: IFloater.Type): Array<Floater> {
    const instances = Object.keys(this._instances);
    let result = [];
    Object.keys(this._instances).forEach((instanceGuid: string) => {
      const instance: Floater = this.getInstanceById(instanceGuid);
      if (instance && instance.configuration.type === instanceType) {
        result.push(instance);
      }
    });
    return result;
  }
}

export const floaterInstances = new FloaterInstances();
